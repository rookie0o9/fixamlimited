"use client";
import Socials from "@/components/socials";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-6 w-full shrink-0 font-semibold border-t border-border">
      <div className="container flex flex-col md:flex-row items-center justify-between">
        <p>
          &copy; 2024{" "}
          <Link
            href="/#top"
            className="cursor-pointer hover:underline underline-offset-4 hover:text-foreground text-primary-alternate"
          >
            Fixam
          </Link>
          . All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Socials />
        </div>
      </div>
    </footer>
  );
}
