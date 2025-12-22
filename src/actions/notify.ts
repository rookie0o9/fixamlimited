"use server";

type LeadKind = "contact" | "inquiry";

export type LeadNotification = {
  timestamp: string;
  kind: LeadKind;
  serviceSlug?: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  referer: string;
};

export type FeedbackNotification = {
  timestamp: string;
  fullName: string;
  email: string;
  rating: number;
  position: string;
  company: string;
  feedback: string;
  publishConsent: boolean;
  referer: string;
};

type ResendEmailRequest = {
  from: string;
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  reply_to?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function splitEmails(value: string) {
  return value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function maybeSendSlackWebhook(payload: unknown) {
  const webhookUrl = clean(process.env.NOTIFY_WEBHOOK_URL);
  if (!webhookUrl) return;

  const res = await fetchWithTimeout(
    webhookUrl,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    },
    5_000
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Webhook failed: ${res.status} ${res.statusText} ${body}`);
  }
}

async function maybeSendResendEmail(payload: ResendEmailRequest) {
  const apiKey = clean(process.env.RESEND_API_KEY);
  if (!apiKey) return;

  const res = await fetchWithTimeout(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    8_000
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend failed: ${res.status} ${res.statusText} ${body}`);
  }
}

function shouldNotify() {
  const enabled = clean(process.env.NOTIFY_ENABLED).toLowerCase();
  if (enabled === "false" || enabled === "0" || enabled === "off") return false;
  return true;
}

export async function notifyLead(lead: LeadNotification) {
  if (!shouldNotify()) return;

  const toRaw = clean(process.env.NOTIFY_EMAIL_TO);
  const from = clean(process.env.NOTIFY_EMAIL_FROM);
  const replyTo = clean(process.env.NOTIFY_EMAIL_REPLY_TO);
  const to = toRaw ? splitEmails(toRaw) : [];

  const subjectPrefix = clean(process.env.NOTIFY_SUBJECT_PREFIX) || "Fixam";
  const subject = `${subjectPrefix}: New ${lead.kind === "inquiry" ? "enquiry" : "contact"} request`;

  const lines = [
    `Time: ${lead.timestamp}`,
    `Type: ${lead.kind}`,
    lead.serviceSlug ? `Service: ${lead.serviceSlug}` : null,
    `Name: ${lead.fullName}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.company ? `Company: ${lead.company}` : null,
    "",
    "Message:",
    lead.message,
    "",
    lead.referer ? `Page: ${lead.referer}` : null,
  ].filter((line): line is string => Boolean(line));

  const text = lines.join("\n");

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">New ${lead.kind === "inquiry" ? "enquiry" : "contact"} request</h2>
      <p style="margin: 0 0 12px; color: #555;">${escapeHtml(lead.timestamp)}</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tr><td style="padding: 6px 0; color: #555; width: 140px;">Type</td><td style="padding: 6px 0;"><strong>${escapeHtml(lead.kind)}</strong></td></tr>
        ${
          lead.serviceSlug
            ? `<tr><td style="padding: 6px 0; color: #555;">Service</td><td style="padding: 6px 0;">${escapeHtml(lead.serviceSlug)}</td></tr>`
            : ""
        }
        <tr><td style="padding: 6px 0; color: #555;">Name</td><td style="padding: 6px 0;">${escapeHtml(lead.fullName)}</td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Email</td><td style="padding: 6px 0;"><a href="mailto:${encodeURIComponent(lead.email)}">${escapeHtml(lead.email)}</a></td></tr>
        ${
          lead.phone
            ? `<tr><td style="padding: 6px 0; color: #555;">Phone</td><td style="padding: 6px 0;"><a href="tel:${encodeURIComponent(lead.phone)}">${escapeHtml(lead.phone)}</a></td></tr>`
            : ""
        }
        ${
          lead.company
            ? `<tr><td style="padding: 6px 0; color: #555;">Company</td><td style="padding: 6px 0;">${escapeHtml(lead.company)}</td></tr>`
            : ""
        }
      </table>
      <h3 style="margin: 18px 0 8px;">Message</h3>
      <pre style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border-radius: 8px;">${escapeHtml(lead.message)}</pre>
      ${
        lead.referer
          ? `<p style="margin: 14px 0 0; color: #555;">Page: <a href="${escapeHtml(lead.referer)}">${escapeHtml(lead.referer)}</a></p>`
          : ""
      }
    </div>
  `.trim();

  const tasks: Promise<unknown>[] = [];

  if (to.length > 0 && from) {
    tasks.push(
      maybeSendResendEmail({
        from,
        to,
        subject,
        text,
        html,
        reply_to: replyTo || undefined,
      })
    );
  }

  const slackPayload = {
    text,
  };
  tasks.push(maybeSendSlackWebhook(slackPayload));

  const results = await Promise.allSettled(tasks);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Notification failed:", result.reason);
    }
  }
}

export async function notifyFeedback(feedback: FeedbackNotification) {
  if (!shouldNotify()) return;

  const toRaw = clean(process.env.NOTIFY_EMAIL_TO);
  const from = clean(process.env.NOTIFY_EMAIL_FROM);
  const replyTo = clean(process.env.NOTIFY_EMAIL_REPLY_TO);
  const to = toRaw ? splitEmails(toRaw) : [];

  const subjectPrefix = clean(process.env.NOTIFY_SUBJECT_PREFIX) || "Fixam";
  const subject = `${subjectPrefix}: New feedback submitted`;

  const lines = [
    `Time: ${feedback.timestamp}`,
    `Name: ${feedback.fullName}`,
    feedback.email ? `Email: ${feedback.email}` : null,
    `Rating: ${feedback.rating}/5`,
    feedback.position ? `Role: ${feedback.position}` : null,
    feedback.company ? `Company: ${feedback.company}` : null,
    `Publish consent: ${feedback.publishConsent ? "Yes" : "No"}`,
    "",
    "Feedback:",
    feedback.feedback,
    "",
    feedback.referer ? `Page: ${feedback.referer}` : null,
  ].filter((line): line is string => Boolean(line));

  const text = lines.join("\n");

  const tasks: Promise<unknown>[] = [];
  if (to.length > 0 && from) {
    tasks.push(
      maybeSendResendEmail({
        from,
        to,
        subject,
        text,
        html: `<pre style="white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${escapeHtml(
          text
        )}</pre>`,
        reply_to: replyTo || undefined,
      })
    );
  }
  tasks.push(maybeSendSlackWebhook({ text }));

  const results = await Promise.allSettled(tasks);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Notification failed:", result.reason);
    }
  }
}

