import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function MobilePortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [el] = useState(() => {
    if (typeof document === "undefined") return null as unknown as HTMLDivElement;
    const node = document.createElement("div");
    node.setAttribute("data-mobile-portal", "");
    return node;
  });

  useEffect(() => {
    if (!el || typeof document === "undefined") return;
    document.body.appendChild(el);
    setMounted(true);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  if (!mounted || !el) return null;
  return createPortal(children, el);
}


