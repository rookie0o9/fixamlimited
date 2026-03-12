import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteUrl = "https://fixam.co.uk";

type PageProps = {
  params: { slug: string };
};

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(isoDate)
  );
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found | Fixam Blog",
      robots: { index: false, follow: false },
      metadataBase: new URL(siteUrl),
    };
  }

  return {
    title: `${post.title} | Fixam Blog`,
    description: post.excerpt,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: "Fixam",
      images: [post.coverImage],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default function BlogArticlePage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = getAllBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "ProfessionalService",
      name: "Fixam",
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    image: `${siteUrl}${post.coverImage}`,
    keywords: post.tags.join(", "),
    articleSection: post.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="bg-background">
        <section className="border-b bg-muted/30">
          <div className="container py-10 md:py-14">
            <p className="text-sm text-muted-foreground">
              <Link href="/blog" className="underline underline-offset-4 hover:text-primary">
                Blog
              </Link>{" "}
              / {post.category}
            </p>
            <h1 className="mt-3 max-w-4xl tracking-tight">{post.title}</h1>
            <p className="mt-4 max-w-3xl text-muted-foreground md:text-lg">
              {post.excerpt}
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {" · "}
              {post.readingMinutes} min read
              {" · "}
              {post.author}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container max-w-3xl space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading ?? section.paragraphs[0]}>
                {section.heading ? (
                  <h2 className="mb-3 tracking-tight text-2xl md:text-3xl">
                    {section.heading}
                  </h2>
                ) : null}
                <div className="space-y-4 text-foreground/90 leading-8">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.checklist?.length ? (
                  <ul className="mt-5 list-disc pl-6 space-y-2 text-foreground/90 leading-7">
                    {section.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <div className="rounded-xl border bg-muted/40 p-6">
              <h3 className="text-xl">Need help implementing this in your team?</h3>
              <p className="mt-2 text-muted-foreground">
                We can turn these controls into a practical rollout plan for your
                environment.
              </p>
              <Link
                href="/?modal=contact"
                className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Contact Fixam
              </Link>
            </div>
          </div>
        </section>
      </article>

      <section className="border-t bg-muted/20 py-12 md:py-14">
        <div className="container">
          <h2 className="tracking-tighter">More from the blog</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <article key={related.slug} className="rounded-xl border bg-background p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                  {related.category}
                </p>
                <h3 className="mt-2 text-lg leading-snug">{related.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{related.excerpt}</p>
                <Link
                  href={`/blog/${related.slug}`}
                  className="mt-3 inline-flex text-sm font-semibold underline underline-offset-4 hover:text-primary"
                >
                  Read article
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
