import { createContext } from "react";

export interface ModalContextType {
  openModal: (content: React.ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export interface ModalOptions {
  title?: string;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
