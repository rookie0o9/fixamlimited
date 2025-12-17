import Parser from "rss-parser";
import { NextResponse } from "next/server";

const FEEDS = [
  {
    source: "CISA",
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
  },
  {
    source: "The Hacker News",
    url: "https://feeds.feedburner.com/TheHackersNews",
  },
  {
    source: "BleepingComputer",
    url: "https://www.bleepingcomputer.com/feed/",
  },
] as const;

type NewsSource = (typeof FEEDS)[number]["source"];

type NewsItem = {
  title: string;
  url: string;
  source: NewsSource;
  publishedAt: string;
  summary: string | undefined;
};

const parser = new Parser();

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const FETCH_TIMEOUT_MS = 10_000;
const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 24;

let cachedItems: NewsItem[] | null = null;
let cachedGeneratedAt: string | null = null;
let cacheExpiresAt = 0;

function clampLimit(raw: string | null): number {
  const value = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(value)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(MAX_LIMIT, value));
}

function safeDate(isoDateOrPubDate?: string | null): string | null {
  if (!isoDateOrPubDate) return null;
  const date = new Date(isoDateOrPubDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

async function fetchWithTimeout(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "fixamlimited/1.0 (+https://fixam.co.uk)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function loadNewsItems(): Promise<{ items: NewsItem[]; generatedAt: string }> {
  const now = Date.now();
  if (cachedItems && cachedGeneratedAt && now < cacheExpiresAt) {
    return { items: cachedItems, generatedAt: cachedGeneratedAt };
  }

  const results = await Promise.allSettled(
    FEEDS.map(async ({ source, url }) => {
      const xml = await fetchWithTimeout(url);
      const feed = await parser.parseString(xml);

      return (feed.items ?? [])
        .map((item) => {
          const title = item.title?.trim();
          const link = item.link?.trim();
          if (!title || !link) return null;

          const publishedAt =
            safeDate(item.isoDate) ?? safeDate(item.pubDate) ?? new Date().toISOString();

          const summary =
            item.contentSnippet?.trim() ||
            item.content?.toString().trim() ||
            item.summary?.toString().trim() ||
            undefined;

          return {
            title,
            url: link,
            source,
            publishedAt,
            summary,
          } satisfies NewsItem;
        })
        .filter((item): item is NewsItem => item !== null);
    })
  );

  const items: NewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") items.push(...result.value);
    else console.error("Failed to load news feed:", result.reason);
  }

  const deduped = new Map<string, NewsItem>();
  for (const item of items) {
    if (!deduped.has(item.url)) deduped.set(item.url, item);
  }

  const sorted = Array.from(deduped.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const generatedAt = new Date().toISOString();
  cachedItems = sorted;
  cachedGeneratedAt = generatedAt;
  cacheExpiresAt = now + CACHE_TTL_MS;

  return { items: sorted, generatedAt };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = clampLimit(url.searchParams.get("limit"));

  const { items, generatedAt } = await loadNewsItems();

  return NextResponse.json(
    {
      generatedAt,
      items: items.slice(0, limit),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    }
  );
}
