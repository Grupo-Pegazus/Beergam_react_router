import { CDN_IMAGES } from "~/src/constants/cdn-images";

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
          <div className="grid grid-cols-1 grid-rows-2 h-full gap-4 max-h-[500px]">
            <div className="bg-beergam-blue-primary-dark rounded-2xl">
              <img
                src={CDN_IMAGES.ANUNCIOS_PREVIEW}
                alt="About"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="bg-beergam-blue-primary-dark rounded-2xl">
              <img
                src={CDN_IMAGES.COLAB_PREVIEW}
                alt="About"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-beergam-orange/20 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
