"use server";

import { auth, sheets } from "@googleapis/sheets";
import { headers } from "next/headers";
import { existsSync, readFileSync } from "node:fs";
import { notifyFeedback } from "@/actions/notify";

export type FeedbackFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<FeedbackFieldName, string>>;
};

type FeedbackFieldName =
  | "fullName"
  | "email"
  | "rating"
  | "position"
  | "company"
  | "feedback";

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

function parseSheetTitleFromRange(range: string) {
  const exclamation = range.indexOf("!");
  if (exclamation <= 0) return null;
  let sheet = range.slice(0, exclamation).trim();

  if (sheet.startsWith("'") && sheet.endsWith("'")) sheet = sheet.slice(1, -1);
  sheet = sheet.replace(/''/g, "'");

  return sheet.trim() || null;
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

function parseRating(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return null;
  if (parsed < 1 || parsed > 5) return null;
  return parsed;
}

function parseBoolean(value: unknown) {
  const cleaned = clean(value).toLowerCase();
  return cleaned === "true" || cleaned === "on" || cleaned === "1" || cleaned === "yes";
}

async function ensureSheetTab(spreadsheetId: string, range: string) {
  if (!sheetsAuth) return;

  const title = parseSheetTitleFromRange(range);
  if (!title) return;

  const existing = await sheets("v4").spreadsheets.get({
    auth: sheetsAuth,
    spreadsheetId,
    fields: "sheets(properties(title))",
  });

  const titles =
    existing.data.sheets
      ?.map((sheet) => sheet.properties?.title)
      .filter((t): t is string => Boolean(t)) ?? [];

  if (titles.includes(title)) return;

  try {
    await sheets("v4").spreadsheets.batchUpdate({
      auth: sheetsAuth,
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title } } }],
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("already exists")) return;
    throw error;
  }
}

async function appendFeedbackRow(values: string[]) {
  const spreadsheetId = normalizeSpreadsheetId(process.env.FEEDBACK_SHEET_ID);
  if (!spreadsheetId || !sheetsAuth) {
    console.warn(
      "FEEDBACK_SHEET_ID / GOOGLE_APPLICATION_CREDENTIALS not set. Feedback logged to console only."
    );
    console.info(values);
    return;
  }

  const range = normalizeA1Range(process.env.FEEDBACK_SHEET_RANGE ?? "Feedback!A1");

  await ensureSheetTab(spreadsheetId, range);

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

export async function submitFeedback(
  _prevState: FeedbackFormState,
  formData: FormData
): Promise<FeedbackFormState> {
  try {
    const honeypot = clean(formData.get("website"));
    if (honeypot) {
      return { status: "success", message: "Thanks — we really appreciate it." };
    }

    const fullName = clean(formData.get("fullName"));
    const email = clean(formData.get("email"));
    const ratingRaw = clean(formData.get("rating"));
    const rating = parseRating(ratingRaw);
    const position = clean(formData.get("position"));
    const company = clean(formData.get("company"));
    const feedback = clean(formData.get("feedback"));
    const publishConsent = parseBoolean(formData.get("publishConsent"));

    const requiresApproval = parseBoolean(process.env.FEEDBACK_REQUIRE_APPROVAL);
    const approved = publishConsent && !requiresApproval;

    const fieldErrors: FeedbackFormState["fieldErrors"] = {};

    if (!fullName) fieldErrors.fullName = "Please enter your name.";
    if (email && !isValidEmail(email))
      fieldErrors.email = "Please enter a valid email address (or leave it blank).";
    if (!rating) fieldErrors.rating = "Please select a rating.";
    if (!feedback) fieldErrors.feedback = "Please tell us what went well (or what we can improve).";

    if (Object.keys(fieldErrors).length > 0) {
      return { status: "error", message: "Please check the form.", fieldErrors };
    }

    if (rating === null) {
      return {
        status: "error",
        message: "Please check the form.",
        fieldErrors: { rating: "Please select a rating." },
      };
    }

    const headerList = headers();
    const referer = headerList.get("referer") ?? "";
    const userAgent = headerList.get("user-agent") ?? "";
    const timestamp = new Date().toISOString();

    await appendFeedbackRow([
      timestamp,
      fullName,
      email,
      String(rating),
      position,
      company,
      feedback,
      publishConsent ? "TRUE" : "FALSE",
      approved ? "TRUE" : "FALSE",
      referer,
      userAgent,
    ]);

    await notifyFeedback({
      timestamp,
      fullName,
      email,
      rating,
      position,
      company,
      feedback,
      publishConsent,
      referer,
    });

    const message = publishConsent
      ? requiresApproval
        ? "Thanks — your feedback has been received and will appear once approved."
        : "Thanks — your feedback has been received."
      : "Thanks — your feedback has been received.";

    return { status: "success", message };
  } catch (error) {
    const ref =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    console.error(`[feedback:${ref}] Error submitting feedback:`, error);
    return {
      status: "error",
      message:
        `Something went wrong (ref: ${ref}). Please email info@fixam.co.uk or call +44 7733 738545.`,
    };
  }
}
