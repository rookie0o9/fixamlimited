import { getAllBlogPosts } from "@/lib/blog";

const siteUrl = "https://fixam.co.uk";

export function GET() {
  const posts = getAllBlogPosts();
  const urls = [
    {
      loc: `${siteUrl}/blog`,
      lastmod: posts[0]?.publishedAt ?? "2026-03-12",
      changefreq: "weekly",
      priority: "0.8",
    },
    ...posts.map((post) => ({
      loc: `${siteUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt ?? post.publishedAt,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];

  const xmlItems = urls
    .map(
      (entry) => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlItems}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
