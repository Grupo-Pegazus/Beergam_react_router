import { useState } from "react";
import { Link } from "react-router";
import { CDN_IMAGES } from "~/src/constants/cdn-images";

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link
              to="#features"
              className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm font-medium"
            >
              Funcionalidades
            </Link>
            <Link
              to="#sobre"
              className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm font-medium"
            >
              Sobre
            </Link>
            <Link
              to="#contato"
              className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm font-medium"
            >
              Contato
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-beergam-white hover:text-beergam-orange transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              to="/registro"
              className="bg-beergam-orange hover:bg-beergam-orange-dark text-beergam-white font-medium text-sm px-6 py-2 rounded-lg transition-colors shadow-lg shadow-beergam-orange/20"
            >
              Cadastre-se
            </Link>
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
                onClick={() => setMobileMenuOpen(false)}
                className="text-beergam-gray-light hover:text-beergam-white transition-colors text-sm font-medium py-2"
              >
                Funcionalidades
              </Link>
              <Link
                to="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="text-beergam-gray-light hover:text-beergam-white transition-colors text-sm font-medium py-2"
              >
                Sobre
              </Link>
              <Link
                to="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="text-beergam-gray-light hover:text-beergam-white transition-colors text-sm font-medium py-2"
              >
                Contato
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
