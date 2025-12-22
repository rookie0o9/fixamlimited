import { notifyText } from "@/actions/notify";
import { NextResponse } from "next/server";

type HandoffPayload = {
  reason?: string;
  message?: string;
  pageUrl?: string;
  pathname?: string;
  serviceSlug?: string;
  name?: string;
  email?: string;
  phone?: string;
  conversationId?: string;
};

const DEDUPE_TTL_MS = 10 * 60 * 1000;
const recent = new Map<string, number>();

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(value: unknown) {
  return clean(value).replace(/\s+/g, " ");
}

function isAuthorized(request: Request) {
  const secret = clean(process.env.BOTPRESS_WEBHOOK_SECRET);
  if (!secret) return false;

  const auth = clean(request.headers.get("authorization"));
  if (!auth.toLowerCase().startsWith("bearer ")) return false;
  const token = auth.slice(7).trim();
  return token === secret;
}

function dedupeKey(payload: HandoffPayload) {
  const conversationId = clean(payload.conversationId);
  const pageUrl = clean(payload.pageUrl);
  const reason = clean(payload.reason).toLowerCase();

  return [conversationId || "no-conversation", pageUrl || "no-page", reason || "handoff"]
    .filter(Boolean)
    .join("|");
}

function isDuplicate(key: string) {
  const now = Date.now();
  for (const entry of Array.from(recent.entries())) {
    const k = entry[0];
    const ts = entry[1];
    if (now - ts > DEDUPE_TTL_MS) recent.delete(k);
  }

  const last = recent.get(key);
  if (last && now - last < DEDUPE_TTL_MS) return true;
  recent.set(key, now);
  return false;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as HandoffPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const key = dedupeKey(payload);
  if (isDuplicate(key)) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  const timestamp = new Date().toISOString();
  const reason = normalize(payload.reason) || "Visitor requested live help";
  const message = normalize(payload.message);
  const pageUrl = normalize(payload.pageUrl) || normalize(payload.pathname);
  const serviceSlug = normalize(payload.serviceSlug);
  const name = normalize(payload.name);
  const email = normalize(payload.email);
  const phone = normalize(payload.phone);
  const conversationId = normalize(payload.conversationId);

  const lines = [
    `Time: ${timestamp}`,
    `Reason: ${reason}`,
    pageUrl ? `Page: ${pageUrl}` : null,
    serviceSlug ? `Service: ${serviceSlug}` : null,
    name ? `Name: ${name}` : null,
    email ? `Email: ${email}` : null,
    phone ? `Phone: ${phone}` : null,
    conversationId ? `Conversation: ${conversationId}` : null,
    message ? "" : null,
    message ? "Message:" : null,
    message || null,
  ].filter((line): line is string => Boolean(line));

  const subjectPrefix = clean(process.env.NOTIFY_SUBJECT_PREFIX) || "Fixam";
  const subject = `${subjectPrefix}: Live help requested (Botpress)`;

  await notifyText(subject, lines.join("\n"));

  return NextResponse.json({ ok: true });
}
