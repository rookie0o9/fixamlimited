"use server";

import { auth, sheets } from "@googleapis/sheets";
import { headers } from "next/headers";
import { existsSync, readFileSync } from "node:fs";
import { notifyLead } from "@/actions/notify";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<LeadFieldName, string>>;
};

type LeadFieldName =
  | "kind"
  | "fullName"
  | "email"
  | "phone"
  | "company"
  | "serviceSlug"
  | "message"
  | "consent";

type LeadKind = "contact" | "inquiry";

function stripWrappingQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function normalizeSpreadsheetId(raw: string | undefined) {
  if (!raw) return null;
  const value = stripWrappingQuotes(raw);
  if (!value) return null;

  const match = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match?.[1] ?? value;
}

function normalizeA1Range(raw: string) {
  const value = stripWrappingQuotes(raw);
  const exclamation = value.indexOf("!");
  if (exclamation <= 0) return value;

  const sheet = value.slice(0, exclamation);
  const rest = value.slice(exclamation);

  if (sheet.startsWith("'")) return value;
  if (!sheet.includes(" ")) return value;

  const escaped = sheet.replace(/'/g, "''");
  return `'${escaped}'${rest}`;
}

function loadCredentials() {
  const rawCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!rawCredentials) return null;

  try {
    if (rawCredentials.startsWith("{")) return JSON.parse(rawCredentials);

    if (
      rawCredentials.startsWith("/") ||
      rawCredentials.startsWith("./") ||
      rawCredentials.startsWith("../") ||
      rawCredentials.endsWith(".json")
    ) {
      if (!existsSync(rawCredentials)) {
        console.error(
          "GOOGLE_APPLICATION_CREDENTIALS points to a file that does not exist."
        );
        return null;
      }

      return JSON.parse(readFileSync(rawCredentials, "utf8"));
    }

    const decoded = Buffer.from(rawCredentials.replace(/\s/g, ""), "base64")
      .toString()
      .replace(/\r?\n/g, "");

    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS:", error);
    return null;
  }
}

const credential = loadCredentials();

const sheetsAuth = credential
  ? new auth.GoogleAuth({
      credentials: credential,
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    })
  : null;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function appendLeadRow(values: string[]) {
  const spreadsheetId = normalizeSpreadsheetId(process.env.LEADS_SHEET_ID);
  if (!spreadsheetId || !sheetsAuth) {
    console.warn(
      "LEADS_SHEET_ID / GOOGLE_APPLICATION_CREDENTIALS not set. Lead logged to console only."
    );
    console.info(values);
    return;
  }

  const range = normalizeA1Range(process.env.LEADS_SHEET_RANGE ?? "Leads!A1");

  await sheets("v4").spreadsheets.values.append({
    auth: sheetsAuth,
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });
}

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  try {
    const honeypot = clean(formData.get("website"));
    if (honeypot) {
      return { status: "success", message: "Thanks — we'll be in touch shortly." };
    }

    const kindRaw = clean(formData.get("kind"));
    const kind: LeadKind = kindRaw === "contact" || kindRaw === "inquiry" ? kindRaw : "contact";

    const fullName = clean(formData.get("fullName"));
    const email = clean(formData.get("email"));
    const phone = clean(formData.get("phone"));
    const company = clean(formData.get("company"));
    const serviceSlug = clean(formData.get("serviceSlug"));
    const message = clean(formData.get("message"));
    const consent =
      formData.get("consent") === "on" || formData.get("consent") === "true";

    const fieldErrors: LeadFormState["fieldErrors"] = {};

    if (!fullName) fieldErrors.fullName = "Please enter your name.";
    if (!email) fieldErrors.email = "Please enter your email.";
    else if (!isValidEmail(email))
      fieldErrors.email = "Please enter a valid email address.";
    if (kind === "inquiry" && !serviceSlug)
      fieldErrors.serviceSlug = "Please select a service.";
    if (!message) fieldErrors.message = "Please add a short message.";
    if (!consent)
      fieldErrors.consent = "Please confirm we can contact you about this request.";

    if (Object.keys(fieldErrors).length > 0) {
      return { status: "error", message: "Please check the form.", fieldErrors };
    }

    const headerList = headers();
    const referer = headerList.get("referer") ?? "";
    const userAgent = headerList.get("user-agent") ?? "";
    const timestamp = new Date().toISOString();

    await appendLeadRow([
      timestamp,
      kind,
      serviceSlug,
      fullName,
      email,
      phone,
      company,
      message,
      referer,
      userAgent,
    ]);

    await notifyLead({
      timestamp,
      kind,
      serviceSlug,
      fullName,
      email,
      phone,
      company,
      message,
      referer,
    });

    return { status: "success", message: "Thanks — we'll be in touch shortly." };
  } catch (error) {
    const ref =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    console.error(`[lead:${ref}] Error submitting lead:`, error);
    return {
      status: "error",
      message:
        `Something went wrong (ref: ${ref}). Please email info@fixam.co.uk or call +44 7733 738545.`,
    };
  }
}
