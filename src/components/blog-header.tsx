import Link from "next/link";

export default function BlogHeader() {
  return (
    <>
      <div id="top" />
      <header className="bg-background/95 text-foreground py-4 px-4 md:px-6 fixed left-0 right-0 w-full border-b border-border z-[10] backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex items-center justify-between">
          <Link href="/blog#top" className="cursor-pointer">
            <span className="font-oswald font-thin text-3xl text-primary-alternate hover:text-foreground">
              fixam blog
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-5 font-semibold">
            <Link href="/blog" className="hover:text-primary-alternate">
              Articles
            </Link>
            <Link href="/blog/rss.xml" className="hover:text-primary-alternate">
              RSS
            </Link>
            <Link href="/" className="hover:text-primary-alternate">
              Main Site
            </Link>
            <Link href="/?modal=contact" className="hover:text-primary-alternate">
              Contact
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
