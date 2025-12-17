import Landing from "@/components/landing";
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
  return <Landing />;
}
