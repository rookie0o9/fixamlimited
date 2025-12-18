"use server";
import { generateAvatar } from "@/lib/avatars";
import { auth, sheets } from "@googleapis/sheets";
import { existsSync, readFileSync } from "node:fs";

export type WebsiteFeedback = {
  avatar: string;
  name: string;
  position: string;
  feedback: string;
  rating?: number;
  source?: "Fixam" | "Trustpilot";
};

function feedbackKey(item: WebsiteFeedback) {
  return [
    item.source ?? "",
    item.name,
    item.position,
    item.feedback,
    typeof item.rating === "number" ? String(item.rating) : "",
  ]
    .map((part) => part.trim().toLowerCase())
    .join("|");
}

function dedupeLatest(items: WebsiteFeedback[]) {
  const seen = new Set<string>();
  const unique: WebsiteFeedback[] = [];

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const key = feedbackKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique; // newest-first
}

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
  if (!rawCredentials) {
    console.warn("GOOGLE_APPLICATION_CREDENTIALS not set. Falling back to dummy feedbacks.");
    return null;
  }

  try {
    if (rawCredentials.startsWith("{")) return JSON.parse(rawCredentials);

    if (
      rawCredentials.startsWith("/") ||
      rawCredentials.startsWith("./") ||
      rawCredentials.startsWith("../") ||
      rawCredentials.endsWith(".json")
    ) {
      if (!existsSync(rawCredentials)) {
        console.warn(
          "GOOGLE_APPLICATION_CREDENTIALS points to a file that does not exist. Falling back to dummy feedbacks."
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

function parseBoolean(value: unknown) {
  const normalized = clean(value).toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}

function parseRating(value: unknown) {
  const normalized = clean(value);
  if (!normalized) return undefined;
  const parsed = Number.parseInt(normalized, 10);
  if (Number.isNaN(parsed)) return undefined;
  if (parsed < 1 || parsed > 5) return undefined;
  return parsed;
}

function formatPosition(position: string, company: string) {
  if (position && company) return `${position} · ${company}`;
  return position || company || "Client";
}

async function sheetsGetValues(spreadsheetId: string, range: string) {
  try {
    if (!sheetsAuth) return [];

    const response = await sheets("v4").spreadsheets.values.get({
      auth: sheetsAuth,
      spreadsheetId,
      range,
    });
    const values = response.data.values;
    if (!values) return [];
    return values as string[][];
  } catch (error) {
    console.error("Error fetching sheet values:", error);
    return [];
  }
}

function generateDummyFeedbacks(count: number = 3) {
  const users = [
    "Jane Forbes",
    "Peter Maze",
    "Claude Mae",
    "Sinclair Kerry",
    "John Kimali",
    "Lucy Falcao",
  ];
  const positions = [
    "Business Owner",
    "IT Manager",
    "Office Administrator",
    "Freelancer",
    "Student",
  ];
  const feedbacks = [
    "Excellent service! Fixed my laptop in no time.",
    "Very professional and knowledgeable team. Highly recommended!",
    "Saved our company's data after a critical system failure. Lifesavers!",
    "Quick response time and efficient problem-solving. Great IT support.",
    "Affordable and reliable. Will definitely use their services again.",
    "Helped set up our entire office network. Smooth and hassle-free experience.",
  ];

  return Array.from({ length: count }, (_, i) => ({
    avatar: generateAvatar(`${users[i]}`),
    name: `${users[i]}`,
    position: positions[Math.floor(Math.random() * positions.length)],
    feedback: feedbacks[i % feedbacks.length],
    rating: 5,
    source: "Fixam",
  })) satisfies WebsiteFeedback[];
}

export async function sheetsGetFeedbacks(limit: number = 3): Promise<WebsiteFeedback[]> {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    if (!sheetsAuth) return isProduction ? [] : generateDummyFeedbacks(Math.min(3, limit));

    const newSheetId = normalizeSpreadsheetId(process.env.FEEDBACK_SHEET_ID);
    if (newSheetId) {
      const range = normalizeA1Range(process.env.FEEDBACK_SHEET_READ_RANGE ?? "Feedback!A1:K");
      const values = await sheetsGetValues(newSheetId, range);

      const items = values
        .map((row) => {
          const fullName = clean(row[1]);
          const email = clean(row[2]);
          const rating = parseRating(row[3]);
          const position = clean(row[4]);
          const company = clean(row[5]);
          const feedback = clean(row[6]);
          const publishConsent = parseBoolean(row[7]);
          const approved = row[8] === undefined ? publishConsent : parseBoolean(row[8]);

          if (!fullName || !feedback) return null;
          if (!approved) return null;

          return {
            avatar: generateAvatar(email || fullName),
            name: fullName,
            position: formatPosition(position, company),
            feedback,
            rating,
            source: "Fixam",
          } satisfies WebsiteFeedback;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      return dedupeLatest(items).slice(0, limit);
    }

    const legacySheetId = process.env.FEEDBACK_FORM_SHEET_ID?.trim();
    if (!legacySheetId) {
      console.warn(
        "FEEDBACK_SHEET_ID / FEEDBACK_FORM_SHEET_ID not set. Falling back to dummy feedbacks."
      );
      return isProduction ? [] : generateDummyFeedbacks(Math.min(3, limit));
    }

    const legacyValues = await sheetsGetValues(legacySheetId, "Form Responses 1!A2:I");
    const legacyItems = legacyValues
      .map((row) => {
        const feedback = clean(row[2]);
        const fullName = clean(row[4]);
        const position = clean(row[6]);
        const isValid = clean(row[7]).toUpperCase() === "TRUE";
        if (!isValid || !fullName || !feedback) return null;

        return {
          avatar: generateAvatar(fullName),
          name: fullName,
          position: position || "Client",
          feedback,
          source: "Fixam",
        } satisfies WebsiteFeedback;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return dedupeLatest(legacyItems).slice(0, limit);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    const isProduction = process.env.NODE_ENV === "production";
    return isProduction ? [] : generateDummyFeedbacks(Math.min(3, limit));
  }
}
