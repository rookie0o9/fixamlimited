"use client";
import useModalContext from "@/hooks/use-modal-context";
import {
  forwardRef,
  HTMLAttributes,
  MouseEventHandler,
  useCallback,
} from "react";
import { mergeRefs } from "react-merge-refs";

export default forwardRef(function ModalTrigger(
  { children, onClick, ...rest }: HTMLAttributes<HTMLButtonElement>,
  ref
) {
  const { modalTrigger, openModal } = useModalContext();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      openModal(e);
      onClick?.(e);
    },
    [onClick, openModal]
  );

  return (
    <button
      ref={mergeRefs([modalTrigger, ref])}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
});
