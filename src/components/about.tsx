import ModalTrigger from "@/components/modal-trigger";
import { ModalIDs } from "@/lib/constants";

export default function About() {
  return (
    <section id="about" className="w-full py-12 md:py-16 bg-background">
      <div className="container space-y-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] lg:items-start">
          {/* Why teams choose fixam */}
          <div className="space-y-4">
            <h2 className="tracking-tighter">Why teams choose fixam</h2>
            <ul className="space-y-2 text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed list-disc pl-5">
              <li>Straightforward advice in plain English and predictable pricing.</li>
              <li>Security-first mindset combined with genuinely friendly support.</li>
              <li>Proactive monitoring, automation and patching to prevent issues.</li>
              <li>Flexible packages, from occasional help to fully managed IT.</li>
            </ul>
            <figure className="mt-6 border-l-2 border-primary pl-4">
              <blockquote className="italic text-muted-foreground">
                “They respond quickly, are always helpful and usually fix issues first time.
                Exactly the kind of IT partner we were looking for.”
              </blockquote>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                — Happy Client
              </figcaption>
            </figure>
          </div>

          {/* IT Fixam + contact */}
          <div className="space-y-4 rounded-xl border bg-muted/60 p-6">
            <h3 className="text-xl font-semibold">IT Fixam</h3>
            <p className="text-muted-foreground">
              Specialist IT support and consultancy for SMEs across the UK—covering cloud,
              connectivity and cyber security without unnecessary jargon.
            </p>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              <span className="rounded-full border px-3 py-1">
                24/7 on-call UK helpdesk
              </span>
              <span className="rounded-full border px-3 py-1">
                Microsoft 365
              </span>
              <span className="rounded-full border px-3 py-1">
                Cyber Essentials
              </span>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground pt-2">
              <h4 className="font-semibold text-foreground">Contact</h4>
              <p>
                <span className="font-semibold">Phone:</span> +44 7733 738545
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:info@fixam.co.uk"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  info@fixam.co.uk
                </a>
              </p>
              <p>
                <span className="font-semibold">Address:</span> 36 Sandpiper Way, Orpington
              </p>
            </div>

            <div className="pt-3">
              <ModalTrigger
                data-id={ModalIDs.Contact}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
              >
                Contact form
              </ModalTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
