import Footer from "@/components/footer";
import Header from "@/components/header";
import Modal from "@/components/modal";
import ModalProvider from "@/components/modal-provider";
import Botpress from "@/components/botpress";
import WhatsppIcon from "@/components/whatsapp-icon";
import type { PropsWithChildren } from "react";

export default function ServicesLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <ModalProvider>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <main className="flex-1 pt-14 md:pt-10 lg:pt-6 bg-background">{children}</main>
        <Footer />
        <WhatsppIcon />
        <Botpress />
      </div>
      <Modal />
    </ModalProvider>
  );
}
