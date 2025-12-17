"use client";

import { useEffect, useMemo, useState } from "react";

type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary?: string;
};

type NewsResponse = {
  generatedAt: string;
  items: NewsItem[];
};

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function truncate(text: string, maxLength: number) {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(date);
}

export default function News() {
  const [response, setResponse] = useState<NewsResponse | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/news?limit=6", {
          headers: { accept: "application/json" },
        });
        if (!res.ok) throw new Error(`Failed to load news: ${res.status}`);

        const data = (await res.json()) as NewsResponse;
        if (!cancelled) setResponse(data);
      } catch {
        if (!cancelled) setHasError(true);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const updatedLabel = useMemo(() => {
    if (!response?.generatedAt) return null;
    const formatted = formatDate(response.generatedAt);
    return formatted ? `Updated ${formatted}` : null;
  }, [response?.generatedAt]);

  return (
    <section id="news" className="w-full py-12 md:py-16 bg-background">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="tracking-tighter">Cybersecurity News</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Latest headlines from CISA, The Hacker News and BleepingComputer.
            </p>
            {updatedLabel ? (
              <p className="text-xs text-muted-foreground">{updatedLabel}</p>
            ) : null}
          </div>
        </div>

        {hasError ? (
          <div className="mx-auto max-w-3xl py-10 text-center">
            <p className="text-muted-foreground">
              Unable to load cybersecurity news right now.
            </p>
          </div>
        ) : response ? (
          <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {response.items.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex flex-col gap-3 rounded-xl border bg-muted/40 p-6 shadow-sm transition-colors hover:bg-muted/60"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {item.source}
                    {item.publishedAt ? ` · ${formatDate(item.publishedAt)}` : ""}
                  </p>
                  <h3 className="text-base font-semibold leading-snug md:text-lg group-hover:underline">
                    {item.title}
                  </h3>
                </div>
                {item.summary ? (
                  <p className="text-sm text-muted-foreground">
                    {truncate(item.summary, 140)}
                  </p>
                ) : null}
                <span className="mt-auto text-sm font-medium text-primary">
                  Read more
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl border bg-muted/40 p-6"
              >
                <div className="h-3 w-32 rounded bg-muted" />
                <div className="mt-4 h-5 w-full rounded bg-muted" />
                <div className="mt-2 h-5 w-5/6 rounded bg-muted" />
                <div className="mt-4 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Headlines are owned by their respective publishers.
        </p>
      </div>
    </section>
  );
}

