import ModalTrigger from "@/components/modal-trigger";
import { ModalIDs } from "@/lib/constants";
import { getServiceBySlug, services } from "@/lib/services";
import type { Metadata } from "next";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

const siteUrl = "https://fixam.co.uk";
const graphImages = [
  "https://i.ibb.co/vZ5p0CM/screenshot.webp",
  "https://i.ibb.co/qx7dhvH/screenshot.png",
];

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return {
      title: "Service not found · Fixam",
      robots: { index: false, follow: false },
      metadataBase: new URL(siteUrl),
    };
  }

  const title = `${service.title} · Fixam`;
  const description = service.description;

  const graph: OpenGraph = {
    images: graphImages,
    description,
    siteName: "Fixam",
    url: `${siteUrl}/services/${service.slug}`,
  };

  return {
    title,
    description,
    openGraph: graph,
    twitter: graph,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}

export default function ServicePage({ params }: PageProps) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const otherServices = services.filter((item) => item.slug !== service.slug);
  const Icon = service.Icon;

  return (
    <>
      <section className="w-full my-16 md:my-20 lg:mt-28 bg-background">
        <div className="container lg:py-10">
          <Link
            href="/#services"
            className="inline-flex items-center text-sm font-semibold text-primary-alternate hover:underline underline-offset-4"
          >
            ← Back to services
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,520px),minmax(0,1fr)] lg:items-start">
            <div className="space-y-4 max-lg:text-center max-lg:max-w-[560px] max-lg:mx-auto">
              <p className="uppercase tracking-[0.2em] text-xs font-semibold text-muted-foreground">
                Service
              </p>
              <h1 className="tracking-tighter">{service.title}</h1>
              <p className="lg:text-lg text-muted-foreground">{service.overview}</p>
              <p className="text-sm font-medium text-muted-foreground">
                {service.description}
              </p>
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:justify-center lg:justify-start pt-2">
                <ModalTrigger
                  data-id={ModalIDs.Inquiry}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
                >
                  Request pricing
                </ModalTrigger>
                <ModalTrigger
                  data-id={ModalIDs.Contact}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
                >
                  Talk to an expert
                </ModalTrigger>
              </div>
            </div>

            <div className="relative max-lg:max-w-[320px] max-lg:mx-auto flex items-center justify-center">
              <div className="flex items-center justify-center rounded-2xl border bg-muted/60 p-10">
                <Icon className="h-20 w-20 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-muted">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="rounded-xl border bg-background p-6">
              <h2 className="tracking-tighter">What’s included</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground list-disc pl-5">
                {service.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border bg-background p-6">
              <h2 className="tracking-tighter">Next steps</h2>
              <p className="mt-4 text-muted-foreground">
                Share a quick overview of your setup and goals—we’ll recommend the
                right package and a simple plan to get started.
              </p>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Phone:</span>{" "}
                  <a
                    href="tel:+447733738545"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    +44 7733 738545
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Email:</span>{" "}
                  <a
                    href="mailto:info@fixam.co.uk"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    info@fixam.co.uk
                  </a>
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row">
                <ModalTrigger
                  data-id={ModalIDs.Contact}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
                >
                  Contact form
                </ModalTrigger>
                <ModalTrigger
                  data-id={ModalIDs.Inquiry}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
                >
                  Request pricing
                </ModalTrigger>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-16 bg-background">
        <div className="container space-y-8">
          <div className="space-y-2">
            <h2 className="tracking-tighter">Explore other services</h2>
            <p className="text-muted-foreground md:text-lg max-w-[900px]">
              Compare options or bundle services for a complete, cloud-first IT setup.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((other) => {
              const OtherIcon = other.Icon;

              return (
                <Link
                  key={other.slug}
                  href={`/services/${other.slug}`}
                  aria-label={`Learn more about ${other.title}`}
                  className="group flex flex-col gap-4 rounded-xl border bg-background p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <OtherIcon className="h-10 w-10 text-primary" />
                  <div className="space-y-2 flex-1">
                    <h3>{other.title}</h3>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {other.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                    Learn more
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
