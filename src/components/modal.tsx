"use client";
import useModalContext from "@/hooks/use-modal-context";

export default function Modal() {
  const { dialog, closeModal, modalIframe } = useModalContext();
  if (!modalIframe) return null;

  return (
    <dialog
      onClick={closeModal}
      ref={dialog}
      className="w-[640px] max-w-full h-full md:rounded-lg"
    >
      <div className="relative h-full">
        <button
          autoFocus
          onClick={closeModal}
          className="absolute top-3 right-5 sm:right-8 text-primary border-2 border-primary rounded-3xl font-semibold px-4 py-1 text-sm uppercase"
        >
          Close
        </button>

        <iframe
          src={modalIframe.src}
          className="w-full h-full py-12"
          title={modalIframe.title}
        >
          <p className="text-center pt-10">Loading…</p>
        </iframe>
      </div>
    </dialog>
  );
}
