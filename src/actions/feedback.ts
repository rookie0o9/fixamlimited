"use server";

import { auth, sheets } from "@googleapis/sheets";
import { headers } from "next/headers";
import { existsSync, readFileSync } from "node:fs";

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

async function appendFeedbackRow(values: string[]) {
  const spreadsheetId = process.env.FEEDBACK_SHEET_ID;
  if (!spreadsheetId || !sheetsAuth) {
    console.warn(
      "FEEDBACK_SHEET_ID / GOOGLE_APPLICATION_CREDENTIALS not set. Feedback logged to console only."
    );
    console.info(values);
    return;
  }

  const range = process.env.FEEDBACK_SHEET_RANGE ?? "Feedback!A1";

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

    const message = publishConsent
      ? requiresApproval
        ? "Thanks — your feedback has been received and will appear once approved."
        : "Thanks — your feedback has been received."
      : "Thanks — your feedback has been received.";

    return { status: "success", message };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return {
      status: "error",
      message:
        "Something went wrong. Please email info@fixam.co.uk or call +44 7733 738545.",
    };
  }
}

