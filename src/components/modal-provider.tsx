"use client";
import { ModalIDs } from "@/lib/constants";
import {
  createContext,
  MouseEventHandler,
  PropsWithChildren,
  RefObject,
  useEffect,
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
};

export const ModalContext = createContext({} as ModalContextType);

export default function ModalProvider({ children }: PropsWithChildren) {
  const [modalId, setModalId] = useState<ModalIDs>();
  const [modalServiceSlug, setModalServiceSlug] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const modalTrigger = useRef<HTMLButtonElement>(null);
  const modalCloseButton = useRef<HTMLButtonElement>(null);

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
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
