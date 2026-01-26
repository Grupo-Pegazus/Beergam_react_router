import { useState, useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router";
import { ThemeToggle } from "../ThemeToggle";
import { SentryFeedback } from "~/features/sentry/components/SentryFeedback";
import { WhatsAppButton } from "../WhatsAppButton";
import { FloatingButton, type FloatingButtonSize } from "../FloatingButton";

export interface FloatingActionButtonsProps {
  /**
   * Tamanho dos botões flutuantes
   * @default "lg"
   */
  size?: FloatingButtonSize;
}

interface AnimatedButtonWrapperProps {
  children: ReactNode;
  index: number;
  totalButtons: number;
  isOpen: boolean;
}

function AnimatedButtonWrapper({
  children,
  index,
  totalButtons,
  isOpen,
}: AnimatedButtonWrapperProps) {
  const calculateDelay = (buttonIndex: number, total: number, opening: boolean): string => {
    if (opening) {
      const delayMs = (total - 1 - buttonIndex) * 80;
      return `${delayMs}ms`;
    }
    const delayMs = buttonIndex * 50;
    return `${delayMs}ms`;
  };

  const delay = calculateDelay(index, totalButtons, isOpen);

  return (
    <div
      className={`transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-4 scale-75"
        }`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
}

export function FloatingActionButtons({
  size = "lg",
}: FloatingActionButtonsProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isInternalRoute = location.pathname.startsWith("/interno");

  const actionButtons: Array<{ component: ReactNode; key: string }> = [
    { component: <ThemeToggle key="theme" size={size} />, key: "theme" },
    { component: <SentryFeedback key="sentry" size={size} />, key: "sentry" },
    { component: <WhatsAppButton key="whatsapp" size={size} />, key: "whatsapp" },
  ];

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside as EventListener);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside as EventListener);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 ${isInternalRoute ? "floating-action-buttons" : ""
        }`}
    >
      <div
        className={`flex flex-col items-end gap-3 ${isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        {actionButtons.map((button, index) => (
          <AnimatedButtonWrapper
            key={button.key}
            index={index}
            totalButtons={actionButtons.length}
            isOpen={isOpen}
          >
            {button.component}
          </AnimatedButtonWrapper>
        ))}
      </div>

      <FloatingButton
        size={size}
        onClick={toggleMenu}
        className="bg-beergam-primary text-white hover:bg-beergam-primary-dark focus:ring-beergam-primary shadow-xl"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        type="button"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen
              ? "opacity-0 rotate-180 scale-0"
              : "opacity-100 rotate-0 scale-100"
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-0"
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </FloatingButton>
    </div>
  );
}
