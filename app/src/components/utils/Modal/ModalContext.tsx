import { createContext } from "react";

export interface ModalContextType {
  openModal: (content: React.ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  isOpen: boolean;
}

export interface ModalOptions {
  title?: string;
  className?: string;
  contentClassName?: string;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
