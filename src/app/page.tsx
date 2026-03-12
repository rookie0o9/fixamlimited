import Landing from "@/components/landing";
import { services } from "@/lib/services";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

const description =
  "Fast, friendly IT support for ambitious teams, with cloud-first solutions and strong security.";

const graph: OpenGraph = {
  images: [
    "https://i.ibb.co/vZ5p0CM/screenshot.webp",
    "https://i.ibb.co/qx7dhvH/screenshot.png",
  ],
  description,
  siteName: "Fixam",
  url: "https://fixam.co.uk",
};
const siteUrl = "https://fixam.co.uk";
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Fixam",
  url: siteUrl,
  image: `${siteUrl}/images/screenshot.webp`,
  telephone: "+44 7733 738545",
  email: "info@fixam.co.uk",
  address: {
    "@type": "PostalAddress",
    streetAddress: "36 Sandpiper Way",
    addressLocality: "Orpington",
    addressCountry: "GB",
  },
  sameAs: [
    "https://www.linkedin.com/company/fixam-co-uk",
    "https://x.com/fixamcouk",
    "https://www.yelp.co.uk/biz/fixam",
  ],
};
const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: service.title,
    url: `${siteUrl}/services/${service.slug}`,
  })),
};

export const metadata: Metadata = {
  title: "IT Support Services · Fixam",
  description,
  openGraph: graph,
  twitter: graph,
  metadataBase: new URL("https://fixam.co.uk"),
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Landing />
    </>
  );
}
