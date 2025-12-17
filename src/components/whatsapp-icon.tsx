import { RiWhatsappLine } from "react-icons/ri";

export default function WhatsppIcon() {
  return (
    <aside className="fixed bottom-20 md:bottom-11 left-4 lg:left-8 z-50">
      <a
        href="https://wa.me/+447733738545"
        className="inline-flex items-center justify-center rounded-full bg-primary-alternate text-white w-12 h-12 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        target="_blank"
        rel="noopener"
      >
        <RiWhatsappLine className="h-8 w-8" />
        <span className="sr-only">WhatsApp</span>
      </a>
    </aside>
  );
}
