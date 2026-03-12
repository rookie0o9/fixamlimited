import Link from "next/link";

export default function BlogFooter() {
  return (
    <footer className="bg-background text-foreground py-8 w-full shrink-0 border-t border-border">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; 2026 Fixam. Insights for secure, reliable business IT.
        </p>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/blog#top" className="hover:text-primary">
            Back to top
          </Link>
          <Link href="/blog/rss.xml" className="hover:text-primary">
            RSS
          </Link>
          <Link href="/" className="hover:text-primary">
            Fixam.co.uk
          </Link>
        </div>
      </div>
    </footer>
  );
}
