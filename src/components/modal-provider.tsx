"use client";
import { ModalIDs } from "@/lib/constants";
import {
  createContext,
  MouseEventHandler,
  PropsWithChildren,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ModalContextType = {
  dialog: RefObject<HTMLDialogElement>;

  modalTrigger: RefObject<HTMLButtonElement>;
  modalCloseButton: RefObject<HTMLButtonElement>;

  openModal: MouseEventHandler<HTMLButtonElement>;
  closeModal: () => void;

  modalIframe?: { src: string; title: string };
};

export const ModalContext = createContext({} as ModalContextType);

export default function ModalProvider({ children }: PropsWithChildren) {
  const [modalId, setModalId] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const modalTrigger = useRef<HTMLButtonElement>(null);
  const modalCloseButton = useRef<HTMLButtonElement>(null);

  const modalIframe = useMemo(() => {
    if (!modalId) return undefined;

    return (
      {
        [ModalIDs.Contact]: {
          src: "https://docs.google.com/forms/d/e/1FAIpQLSfeIx-h9mbg9gUak8Cpk5PkZx9mNMjtyP2wz71UcnPHWwHJbg/viewform?embedded=true",
          title: "Contact Form",
        },
        [ModalIDs.Inquiry]: {
          src: "https://docs.google.com/forms/d/e/1FAIpQLSdkayjCRoKltyn7Brwf59ftD3Z-VF7EfgOqIqqx-DyCV8LlHg/viewform?embedded=true",
          title: "Inquiry Form",
        },
        [ModalIDs.Feedback]: {
          src: "https://docs.google.com/forms/d/e/1FAIpQLScFwj091WMVaO66pe2qAzT7uJQyBWaXCQPuR8F5XesDtS07lw/viewform?embedded=true",
          title: "Feedback Form",
        },
      }[modalId] || undefined
    );
  }, [modalId]);

  const openModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const { id } = e.currentTarget.dataset;
    setModalId(id);
  };
  const closeModal = () => setModalId(undefined);

  useEffect(() => {
    if (modalId) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modalId]);

  return (
    <ModalContext.Provider
      value={{
        dialog,
        modalTrigger,
        modalCloseButton,

        openModal,
        closeModal,

        modalIframe,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
