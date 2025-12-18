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

  modalId?: ModalIDs;
  modalServiceSlug?: string;

  modalIframe?: { src: string; title: string };
};

export const ModalContext = createContext({} as ModalContextType);

export default function ModalProvider({ children }: PropsWithChildren) {
  const [modalId, setModalId] = useState<ModalIDs>();
  const [modalServiceSlug, setModalServiceSlug] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const modalTrigger = useRef<HTMLButtonElement>(null);
  const modalCloseButton = useRef<HTMLButtonElement>(null);

  const modalIframe = useMemo(() => {
    if (modalId !== ModalIDs.Feedback) return undefined;

    return {
      src: "https://docs.google.com/forms/d/e/1FAIpQLScFwj091WMVaO66pe2qAzT7uJQyBWaXCQPuR8F5XesDtS07lw/viewform?embedded=true",
      title: "Feedback Form",
    };
  }, [modalId]);

  const openModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const { id, service } = e.currentTarget.dataset;
    if (!id) return;

    setModalId(id as ModalIDs);
    setModalServiceSlug(service);
  };
  const closeModal = () => {
    setModalId(undefined);
    setModalServiceSlug(undefined);
  };

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

        modalId,
        modalServiceSlug,
        modalIframe,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
