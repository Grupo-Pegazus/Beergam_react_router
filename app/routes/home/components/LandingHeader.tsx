import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { CDN_IMAGES } from "~/src/constants/cdn-images";

type NavLink = {
  id: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { id: "features", label: "Funcionalidades" },
  { id: "sobre", label: "Sobre" },
  { id: "planos", label: "Planos" },
];

let scrollTriggerRegistered = false;

if (typeof window !== "undefined" && !scrollTriggerRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  scrollTriggerRegistered = true;
}

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [lockedSection, setLockedSection] = useState<string | null>(null);
  const lockedSectionRef = useRef<string | null>(null);
  const triggersRef = useRef<Record<string, ScrollTrigger>>({});

  useEffect(() => {
    lockedSectionRef.current = lockedSection;
  }, [lockedSection]);

  const handleNavClick = (id: string) => {
    lockedSectionRef.current = id;
    setLockedSection(id);
    setActiveSection(id);
    setMobileMenuOpen(false);

    const trigger = triggersRef.current[id];
    if (trigger?.isActive) {
      lockedSectionRef.current = null;
      setLockedSection(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = NAV_LINKS.map(({ id }) =>
      document.getElementById(id)
    ).filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      setActiveSection(null);
      return;
    }

    const navIds = sections.map((section) => section.id);

    const triggers = sections.map((section) => {
      const triggerInstance = ScrollTrigger.create({
        trigger: section,
        start: "top 65px",
        end: "bottom",
        onToggle: (self) => {
          const currentLock = lockedSectionRef.current;

          if (currentLock && currentLock !== section.id) {
            return;
          }

          if (self.isActive) {
            setActiveSection(section.id);
            if (currentLock === section.id) {
              lockedSectionRef.current = null;
              setLockedSection(null);
            }
            return;
          }

          const anyActive = ScrollTrigger.getAll().some((trigger) => {
            const triggerId = (trigger.trigger as HTMLElement | undefined)?.id;
            return (
              trigger.isActive && !!triggerId && navIds.includes(triggerId)
            );
          });

          if (!anyActive) {
            setActiveSection(null);
          }
        },
      });

      triggersRef.current[section.id] = triggerInstance;
      return triggerInstance;
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => {
        const triggerId = (trigger.trigger as HTMLElement | undefined)?.id;
        if (triggerId) {
          delete triggersRef.current[triggerId];
        }
        trigger.kill();
      });
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-beergam-blue-lara/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={CDN_IMAGES.BERGAMOTA_LOGO}
              alt="Beergam Logo"
              className="w-10 h-10 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                to={`#${link.id}`}
                viewTransition
                onClick={() => handleNavClick(link.id)}
                aria-current={activeSection === link.id ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? "text-beergam-orange active relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-beergam-orange after:transition-all after:w-full after:scale-x-100"
                    : "text-beergam-gray-light hover:text-beergam-orange relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-beergam-orange after:transition-all after:w-0 after:scale-x-0"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            <BeergamButton
              title="Login"
              animationStyle="fade"
              link="/login"
              mainColor="beergam-orange"
              className="text-beergam-gray-light!"
            />
            <BeergamButton
              title="Cadastre-se"
              animationStyle="fade"
              link="/registro"
              className="text-beergam-white! bg-beergam-orange!"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-beergam-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-slide-down">
            <nav className="flex flex-col gap-4">
              <Link
                to="#features"
                onClick={() => handleNavClick("features")}
                aria-current={activeSection === "features" ? "page" : undefined}
                className={`text-sm font-medium py-2 transition-colors ${
                  activeSection === "features"
                    ? "text-beergam-orange"
                    : "text-beergam-gray-light hover:text-beergam-white"
                }`}
              >
                Funcionalidades
              </Link>
              <Link
                to="#sobre"
                onClick={() => handleNavClick("sobre")}
                aria-current={activeSection === "sobre" ? "page" : undefined}
                className={`text-sm font-medium py-2 transition-colors ${
                  activeSection === "sobre"
                    ? "text-beergam-orange"
                    : "text-beergam-gray-light hover:text-beergam-white"
                }`}
              >
                Sobre
              </Link>
              <Link
                to="#planos"
                onClick={() => handleNavClick("planos")}
                aria-current={activeSection === "planos" ? "page" : undefined}
                className={`text-sm font-medium py-2 transition-colors ${
                  activeSection === "planos"
                    ? "text-beergam-orange"
                    : "text-beergam-gray-light hover:text-beergam-white"
                }`}
              >
                Planos
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-beergam-white hover:text-beergam-orange transition-colors text-sm font-medium py-2 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-beergam-orange hover:bg-beergam-orange-dark text-beergam-white font-medium text-sm px-6 py-2 rounded-lg transition-colors shadow-lg shadow-beergam-orange/20 text-center"
                >
                  Cadastre-se
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
