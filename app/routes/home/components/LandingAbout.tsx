export default function LandingAbout() {
  return (
    <section id="sobre" className="py-24 bg-beergam-blue-lara">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-beergam-white mb-6">
              Por que escolher o Beergam?
            </h2>
            <p className="text-lg text-beergam-gray-light mb-6 leading-relaxed">
              Somos especialistas em soluções para e-commerce. Com mais de 10
              anos de experiência, desenvolvemos uma plataforma completa que
              atende desde pequenos vendedores até grandes operações.
            </p>
            <p className="text-lg text-beergam-gray-light mb-8 leading-relaxed">
              Nossa missão é simplificar a gestão do seu negócio online,
              permitindo que você se concentre no que realmente importa: fazer
              sua empresa crescer.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-beergam-orange flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-beergam-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-beergam-white font-semibold mb-1">
                    Integração Completa
                  </h3>
                  <p className="text-beergam-gray-light text-sm">
                    Conecte-se com os principais marketplaces do Brasil em um
                    único lugar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-beergam-orange flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-beergam-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-beergam-white font-semibold mb-1">
                    Automação Inteligente
                  </h3>
                  <p className="text-beergam-gray-light text-sm">
                    Reduza erros e economize tempo com processos automatizados
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-beergam-orange flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-beergam-white text-sm">✓</span>
                </div>
                <div>
                  <h3 className="text-beergam-white font-semibold mb-1">
                    Suporte Dedicado
                  </h3>
                  <p className="text-beergam-gray-light text-sm">
                    Equipe especializada pronta para ajudar você a crescer
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-beergam-blue-primary-dark rounded-2xl p-8 border border-white/10">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-beergam-blue-lara/50 rounded-lg border border-white/10">
                  <span className="text-beergam-gray-light">
                    Marketplaces Integrados
                  </span>
                  <span className="text-beergam-orange font-bold text-xl">
                    1
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-beergam-blue-lara/50 rounded-lg border border-white/10">
                  <span className="text-beergam-gray-light">
                    Vendedores Ativos
                  </span>
                  <span className="text-beergam-orange font-bold text-xl">
                    200K+
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-beergam-blue-lara/50 rounded-lg border border-white/10">
                  <span className="text-beergam-gray-light">Pedidos/Mês</span>
                  <span className="text-beergam-orange font-bold text-xl">
                    100M+
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-beergam-blue-lara/50 rounded-lg border border-white/10">
                  <span className="text-beergam-gray-light">Uptime</span>
                  <span className="text-beergam-orange font-bold text-xl">
                    99.9%
                  </span>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-beergam-orange/20 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
