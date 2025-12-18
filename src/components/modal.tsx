"use client";
import useModalContext from "@/hooks/use-modal-context";
import { ModalIDs } from "@/lib/constants";
import LeadForm from "@/components/lead-form";
import FeedbackForm from "@/components/feedback-form";

export default function Modal() {
  const { dialog, closeModal, modalId, modalServiceSlug } = useModalContext();
  if (!modalId) return null;

  return (
    <dialog
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      onCancel={(e) => {
        e.preventDefault();
        closeModal();
      }}
      ref={dialog}
      className="w-[720px] max-w-[calc(100%-1rem)] bg-background text-foreground p-0 md:rounded-lg"
    >
      <div className="relative">
        <button
          autoFocus
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-primary border-2 border-primary rounded-3xl font-semibold px-4 py-1 text-sm uppercase bg-background"
        >
          Close
        </button>
        <div className="max-h-[calc(100vh-2rem)] overflow-auto p-6 pt-16 md:p-8 md:pt-16">
          {modalId === ModalIDs.Feedback ? (
            <FeedbackForm />
          ) : modalId === ModalIDs.Inquiry ? (
            <LeadForm kind="inquiry" defaultServiceSlug={modalServiceSlug} />
          ) : modalId === ModalIDs.Contact ? (
            <LeadForm kind="contact" />
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
