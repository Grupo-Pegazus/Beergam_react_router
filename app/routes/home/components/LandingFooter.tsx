import { Link } from "react-router";
import { CDN_IMAGES } from "~/src/constants/cdn-images";
export default function LandingFooter() {
  return (
    <footer className="bg-beergam-blue-lara border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src={CDN_IMAGES.BERGAMOTA_LOGO}
                alt="Beergam Logo"
                className="w-10 h-10 object-contain"
              />
            </Link>
            <p className="text-beergam-gray-light text-sm">
              O ERP completo para vendedores de e-commerce no Brasil.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-beergam-white font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#features"
                  className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm"
                >
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link
                  to="#sobre"
                  className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  to="#planos"
                  className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm"
                >
                  Planos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-beergam-white font-semibold mb-4">Conta</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/registro"
                  className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm"
                >
                  Cadastre-se
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-beergam-gray-light text-sm">
            © {new Date().getFullYear()} Beergam. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link
              to="#"
              className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm"
            >
              Termos de Serviço
            </Link>
            <Link
              to="#"
              className="text-beergam-gray-light hover:text-beergam-orange transition-colors text-sm"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
