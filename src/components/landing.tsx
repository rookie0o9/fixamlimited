import ModalProvider from "@/components/modal-provider";
import Modal from "@/components/modal";
import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsppIcon from "@/components/whatsapp-icon";
import About from "@/components/about";
import Services from "@/components/services";
import Hero from "@/components/hero";
import Feedbacks from "@/components/feedbacks";
import Botpress from "@/components/botpress";
import BlockmarkWidget from "@/components/blockmark-widget";
import News from "@/components/news";

export default function Landing() {
  return (
    <ModalProvider>
      <div className="flex flex-col min-h-[100dvh]">
        <Header />
        <main className="flex-1 pt-14 md:pt-10 lg:pt-6 bg-black">
          <Hero />
          <Services />
          <About />
          <Feedbacks />
          <News />
          <BlockmarkWidget /> 
          <Botpress />
        </main>
        <Footer />
        <WhatsppIcon />
      </div>
      <Modal />
    </ModalProvider>
  );
}
