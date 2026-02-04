import { createContext } from "react";
import Svg from "~/src/assets/svgs/_index";
export interface ModalContextType {
  openModal: (content: React.ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export interface ModalOptions {
  title?: string;
  icon?: keyof typeof Svg;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
