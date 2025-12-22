"use client";
import { ModalIDs } from "@/lib/constants";
import { usePathname } from "next/navigation";
import {
  createContext,
  MouseEventHandler,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

function isModalId(value: string): value is ModalIDs {
  return (
    value === ModalIDs.Contact ||
    value === ModalIDs.Inquiry ||
    value === ModalIDs.Feedback
  );
}

function getServiceSlugFromPathname(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 2 && parts[0] === "services") return parts[1];
  return undefined;
}

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
  const pathname = usePathname();

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("modal")?.trim();
    if (!requested) return;
    if (!isModalId(requested)) return;

    const requestedService =
      params.get("service")?.trim() ||
      (requested === ModalIDs.Inquiry
        ? getServiceSlugFromPathname(pathname)
        : undefined);

    setModalId(requested);
    setModalServiceSlug(requestedService);
  }, [pathname]);

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
