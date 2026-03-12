import { getAllBlogPosts } from "@/lib/blog";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BLOG_HOSTS = new Set(["blog.fixam.co.uk", "www.blog.fixam.co.uk"]);
const BLOG_SLUGS = new Set(getAllBlogPosts().map((post) => post.slug));

function isBlogHost(hostHeader: string | null) {
  if (!hostHeader) return false;
  const host = hostHeader.split(":")[0].toLowerCase();
  return BLOG_HOSTS.has(host);
}

export function middleware(request: NextRequest) {
  if (!isBlogHost(request.headers.get("host"))) return NextResponse.next();

  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest"
  ) {
    return NextResponse.next();
  }

  const rewrite = request.nextUrl.clone();

  if (
    pathname === "/" ||
    pathname === "/projects" ||
    pathname === "/index.html" ||
    pathname === "/libs/index.html"
  ) {
    rewrite.pathname = "/blog";
    return NextResponse.rewrite(rewrite);
  }

  if (pathname === "/rss.xml") {
    rewrite.pathname = "/blog/rss.xml";
    return NextResponse.rewrite(rewrite);
  }

  if (pathname === "/sitemap.xml") {
    rewrite.pathname = "/blog/sitemap.xml";
    return NextResponse.rewrite(rewrite);
  }

  const rootLevelPath = pathname.replace(/^\/|\/$/g, "");
  if (BLOG_SLUGS.has(rootLevelPath)) {
    rewrite.pathname = `/blog/${rootLevelPath}`;
    return NextResponse.rewrite(rewrite);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
