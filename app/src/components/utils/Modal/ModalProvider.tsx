import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "./index";
import { ModalContext, type ModalOptions } from "./ModalContext";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({});
  const onCloseRef = useRef<(() => void) | undefined>(undefined);

  // Atualiza a ref sempre que modalOptions.onClose mudar
  useEffect(() => {
    onCloseRef.current = modalOptions.onClose;
  }, [modalOptions.onClose]);

  const openModal = useCallback(
    (content: React.ReactNode, options?: ModalOptions) => {
      setModalContent(content);
      setModalOptions(options || {});
      setIsOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    // Executa a função onClose se foi fornecida nas opções
    if (onCloseRef.current) {
      onCloseRef.current();
    }
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalOptions.title}
        className={modalOptions.className}
        contentClassName={modalOptions.contentClassName}
      >
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
}
