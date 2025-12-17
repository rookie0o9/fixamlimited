"use client";
import { Link as ScrollLink } from "react-scroll";
import Socials from "@/components/socials";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="bg-black text-primary-foreground py-6 w-full shrink-0 font-semibold">
      <div className="container flex flex-col md:flex-row items-center justify-between">
        <p>
          &copy; 2024{" "}
          {isHome ? (
            <ScrollLink
              to="top"
              className="cursor-pointer hover:underline underline-offset-4 hover:text-primary-foreground text-primary-alternate"
              smooth
            >
              Fixam
            </ScrollLink>
          ) : (
            <Link
              href="/"
              className="cursor-pointer hover:underline underline-offset-4 hover:text-primary-foreground text-primary-alternate"
            >
              Fixam
            </Link>
          )}
          . All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Socials />
        </div>
      </div>
    </footer>
  );
}
