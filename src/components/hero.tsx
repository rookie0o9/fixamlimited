import ModalTrigger from "@/components/modal-trigger";
import { ModalIDs } from "@/lib/constants";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="w-full my-16 md:my-20 lg:mt-28 bg-background">
      <div className="container lg:py-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,480px),minmax(0,1fr)] lg:items-center">
          <div className="space-y-4 max-lg:text-center max-lg:max-w-[520px] max-lg:mx-auto">
            <p className="uppercase tracking-[0.2em] text-xs font-semibold text-muted-foreground">
              Business IT Support
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-bold tracking-tighter">
              Fast, friendly IT for ambitious teams
            </h1>
            <p className="lg:text-lg text-muted-foreground">
              Keep your team productive with proactive support, cloud-first solutions
              and strong security. We take care of the tech so you can focus on growth.
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              SLA-backed ISO-ready Microsoft Partner
            </p>
            <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:justify-center lg:justify-start pt-2">
              <ModalTrigger
                data-id={ModalIDs.Inquiry}
                data-service="business-it-support"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
              >
                See support packages
              </ModalTrigger>
              <ModalTrigger
                data-id={ModalIDs.Contact}
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
              >
                Talk to an expert
              </ModalTrigger>
            </div>
          </div>

          <div className="relative max-lg:max-w-[400px] max-lg:mx-auto">
            <Image
              src="/images/illustration.webp"
              alt="Fixam team providing business IT support"
              width={640}
              height={460}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
