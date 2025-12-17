"use client";

import ModalTrigger from "@/components/modal-trigger";
import { ModalIDs } from "@/lib/constants";
import { Link as ScrollLink } from "react-scroll";
import Socials from "@/components/socials";

export default function Header() {
  return (
    <>
      <div id="top" />
      <header className="bg-black text-primary-foreground py-4 px-4 md:px-6 fixed left-0 right-0 w-full border-b-2 border-primary-foreground z-[10]">
        <div className="container flex items-center justify-between">
          <ScrollLink to="top" className="cursor-pointer" smooth>
            <span className="font-oswald font-thin text-3xl text-primary-alternate hover:text-primary-foreground">
              fixam
            </span>
          </ScrollLink>
          <nav className="hidden md:flex items-center gap-4">
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
            <ModalTrigger
              data-id={ModalIDs.Contact}
              className="hover:text-primary-alternate font-semibold underline-offset-4"
            >
              Contact
            </ModalTrigger>
          </nav>
          <div className="flex items-center gap-4">
            <ModalTrigger
              data-id={ModalIDs.Feedback}
              className="inline-flex h-9 items-center justify-center rounded-3xl bg-transparent px-4 py-2 text-sm text-primary-foreground border-2 font-semibold border-primary-foreground shadow transition-colors hover:bg-primary-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
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
