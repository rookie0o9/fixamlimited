"use client";

import ModalTrigger from "@/components/modal-trigger";
import { ModalIDs } from "@/lib/constants";
import { Link as ScrollLink } from "react-scroll";
import Socials from "@/components/socials";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <div id="top" />
      <header className="bg-background/95 text-foreground py-4 px-4 md:px-6 fixed left-0 right-0 w-full border-b border-border z-[10] backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container flex items-center justify-between">
          {isHome ? (
            <ScrollLink to="top" className="cursor-pointer" smooth>
              <span className="font-oswald font-thin text-3xl text-primary-alternate hover:text-foreground">
                fixam
              </span>
            </ScrollLink>
          ) : (
            <Link href="/" className="cursor-pointer">
              <span className="font-oswald font-thin text-3xl text-primary-alternate hover:text-foreground">
                fixam
              </span>
            </Link>
          )}
          <nav className="hidden md:flex items-center gap-4">
            {isHome ? (
              <>
                <ScrollLink
                  to="services"
                  className="hover:text-primary-alternate font-semibold underline-offset-4 cursor-pointer"
                  smooth
                >
                  Services
                </ScrollLink>
                <ScrollLink
                  to="about"
                  className="hover:text-primary-alternate font-semibold underline-offset-4 cursor-pointer"
                  smooth
                >
                  About
                </ScrollLink>
                <ScrollLink
                  to="news"
                  className="hover:text-primary-alternate font-semibold underline-offset-4 cursor-pointer"
                  smooth
                >
                  News
                </ScrollLink>
              </>
            ) : (
              <>
                <Link
                  href="/#services"
                  className="hover:text-primary-alternate font-semibold underline-offset-4 cursor-pointer"
                >
                  Services
                </Link>
                <Link
                  href="/#about"
                  className="hover:text-primary-alternate font-semibold underline-offset-4 cursor-pointer"
                >
                  About
                </Link>
                <Link
                  href="/#news"
                  className="hover:text-primary-alternate font-semibold underline-offset-4 cursor-pointer"
                >
                  News
                </Link>
              </>
            )}
            <ModalTrigger
              data-id={ModalIDs.Contact}
              className="hover:text-primary-alternate font-semibold underline-offset-4"
            >
              Contact
            </ModalTrigger>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ModalTrigger
              data-id={ModalIDs.Feedback}
              className="inline-flex h-9 items-center justify-center rounded-3xl bg-transparent px-4 py-2 text-sm text-foreground border font-semibold border-border shadow transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Leave a Feedback
            </ModalTrigger>
            <div className="hidden md:flex items-center gap-4">
              <Socials />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
