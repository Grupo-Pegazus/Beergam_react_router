import React, { useEffect, useState } from "react";
import Svg from "~/src/assets/svgs/_index";

interface ModalProps {
  abrir: boolean;
  onClose: (params: { abrir: boolean }) => void;
  children: React.ReactNode;
  titleModal?: string;
  style?: React.CSSProperties | string;
  styleSair?: React.CSSProperties;
  iconVoltar?: boolean;
}

function Modal({
  abrir,
  onClose,
  children,
  titleModal,
  style,
  iconVoltar,
  styleSair,
}: ModalProps) {
  const [fadeAnimation, setFadeAnimation] = useState(abrir);
  useEffect(() => {
    setFadeAnimation(abrir);
  }, [abrir]);
  const handleClose = () => {
    setFadeAnimation(false);
    setTimeout(() => {
      onClose({ abrir: false });
    }, 300);
  };

  return (
    <div
      className="fixed w-full justify-center items-center top-0 left-0 h-full z-999 transition-all duration-300 ease-in-out"
      style={{
        display: abrir ? "flex" : "none",
        opacity: fadeAnimation ? 1 : 0,
      }}
    >
      <button
        className={`fixed top-0 left-0 w-screen h-screen bg-black/40 flex justify-center items-center z-[-1] ${
          abrir
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onMouseDown={(e) => {
          if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          handleClose();
        }}
      ></button>
      <div
        className={`relative max-h-[95vh] p-6 rounded-xl bg-white shadow-lg mx-auto transition-all duration-300 ease-in-out overflow-y-auto ${
          abrir ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } md:w-auto`}
        style={typeof style === "string" ? { [style]: "" } : style}
      >
        {titleModal && (
          <h2 className="text-center mb-8 md:text-base md:text-left">
            {titleModal}
          </h2>
        )}
        <button
          className="absolute top-5 right-3 text-2xl bg-transparent border-none cursor-pointer md:top-[23px] md:right-5 md:text-base"
          onClick={handleClose}
          style={styleSair}
        >
          {!iconVoltar ? (
            <Svg.x
              width={24}
              height={24}
              tailWindClasses="hover:text-beergam-orange"
            />
          ) : (
            <i className="fa-solid fa-arrow-left"></i>
          )}
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
