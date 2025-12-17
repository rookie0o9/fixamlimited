import Link from "next/link";
import { services } from "@/lib/services";

export default function Services() {
  return (
    <section id="services" className="w-full py-12 md:py-16 bg-muted">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="tracking-tighter">Services</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Cloud-first support packages that keep your people productive and secure.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map(({ slug, title, description, Icon }) => (
            <Link
              key={slug}
              href={`/services/${slug}`}
              aria-label={`Learn more about ${title}`}
              className="group flex flex-col gap-4 rounded-xl border bg-background p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Icon className="h-12 w-12 text-primary" />
              <div className="space-y-2 flex-1">
                <h3>{title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  {description}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary underline-offset-4 group-hover:underline">
                Learn more
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
