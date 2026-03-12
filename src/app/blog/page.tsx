import { getAllBlogPosts } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://fixam.co.uk";
const pageTitle = "Fixam Blog | IT, Security, and Microsoft 365";
const description =
  "Practical guidance from Fixam on cyber security, Microsoft 365, and reliable IT operations for growing teams.";

export const metadata: Metadata = {
  title: pageTitle,
  description,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/blog" },
  openGraph: {
    title: pageTitle,
    description,
    type: "website",
    url: `${siteUrl}/blog`,
    siteName: "Fixam",
    images: ["https://i.ibb.co/vZ5p0CM/screenshot.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description,
    images: ["https://i.ibb.co/vZ5p0CM/screenshot.webp"],
  },
};

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(isoDate)
  );
}

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const [featured, ...rest] = posts;
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Fixam Blog",
    url: `${siteUrl}/blog`,
    description,
    publisher: {
      "@type": "ProfessionalService",
      name: "Fixam",
      url: siteUrl,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: {
        "@type": "Organization",
        name: post.author,
      },
      url: `${siteUrl}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <section className="border-b bg-[linear-gradient(120deg,hsl(var(--primary)/0.12),hsl(var(--background))_45%,hsl(var(--primary-alternate)/0.18))]">
        <div className="container py-14 md:py-20">
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            Fixam Blog
          </p>
          <h1 className="mt-3 max-w-4xl tracking-tight">
            Practical IT and cyber guidance for ambitious teams
          </h1>
          <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">
            Short, actionable articles on operations, security hardening, and
            Microsoft 365 delivery for growing businesses.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              href="/blog/rss.xml"
              className="inline-flex items-center rounded-full border px-4 py-2 font-semibold hover:bg-accent"
            >
              Subscribe via RSS
            </Link>
            <Link
              href="/?modal=contact"
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Talk to Fixam
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container space-y-10">
          <div className="space-y-3">
            <h2 className="tracking-tighter">Featured</h2>
            <article className="rounded-2xl border bg-muted/40 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                {featured.category}
              </p>
              <h3 className="mt-2 text-2xl md:text-3xl">{featured.title}</h3>
              <p className="mt-3 max-w-3xl text-muted-foreground">{featured.excerpt}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                <time dateTime={featured.publishedAt}>
                  {formatDate(featured.publishedAt)}
                </time>{" "}
                · {featured.readingMinutes} min read
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Read article
              </Link>
            </article>
          </div>

          <div className="space-y-4">
            <h2 className="tracking-tighter">Latest Articles</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-xl leading-tight">{post.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    {" · "}
                    {post.readingMinutes} min
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold underline underline-offset-4 hover:text-primary"
                  >
                    Read article
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
