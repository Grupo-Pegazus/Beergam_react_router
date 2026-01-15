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
                  <span className="text-beergam-white text-sm!">✓</span>
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
                  <span className="text-beergam-white text-sm!">✓</span>
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
                  <span className="text-beergam-white text-sm!">✓</span>
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
          <div className="grid grid-cols-1 grid-rows-2 h-full gap-4 max-h-[500px] min-h-[400px]">
            <div className="bg-beergam-blue-primary-dark rounded-2xl bg-size-[350%] md:bg-size-[200%] bg-position-[bottom_-20px_left] md:bg-position-[bottom_left]" style={{ backgroundImage: `url(${CDN_IMAGES.ANUNCIOS_PREVIEW})` }}>
            </div>
            <div className="bg-beergam-blue-primary-dark rounded-2xl bg-size-[350%] md:bg-size-[220%] bg-position-[right_610px_top_-120px] md:bg-position-[right_900px_top_-120px]" style={{ backgroundImage: `url(${CDN_IMAGES.COLAB_PREVIEW})` }}>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
