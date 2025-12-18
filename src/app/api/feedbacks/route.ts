import { sheetsGetFeedbacks } from "@/actions/sheets";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 24;

function clampLimit(raw: string | null): number {
  const value = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(value)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(MAX_LIMIT, value));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = clampLimit(url.searchParams.get("limit"));

  const items = await sheetsGetFeedbacks(limit);

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      items,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
