import Botpress from "@/components/botpress";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Modal from "@/components/modal";
import ModalProvider from "@/components/modal-provider";
import News from "@/components/news";
import WhatsppIcon from "@/components/whatsapp-icon";
import type { Metadata } from "next";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

const description =
  "Latest cybersecurity headlines from trusted sources, curated for UK teams that care about risk and resilience.";

const graph: OpenGraph = {
  images: [
    "https://i.ibb.co/vZ5p0CM/screenshot.webp",
    "https://i.ibb.co/qx7dhvH/screenshot.png",
  ],
  description,
  siteName: "Fixam",
  url: "https://fixam.co.uk/news",
};

export const metadata: Metadata = {
  title: "Cybersecurity News · Fixam",
  description,
  openGraph: graph,
  twitter: graph,
  metadataBase: new URL("https://fixam.co.uk"),
  alternates: {
    canonical: "/news",
  },
};

export default function NewsPage() {
  return (
    <ModalProvider>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <main className="flex-1 pt-14 md:pt-10 lg:pt-6 bg-background">
          <News />
          <Botpress />
        </main>
        <Footer />
        <WhatsppIcon />
      </div>
      <Modal />
    </ModalProvider>
  );
}
