import { ModalContext } from "@/components/modal-provider";
import { useContext } from "react";

export default function useModalContext() {
  const contextValue = useContext(ModalContext);

  return contextValue;
}
