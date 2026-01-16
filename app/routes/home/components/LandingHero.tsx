import { Link } from "react-router";

export default function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-beergam-blue-lara via-beergam-blue-primary-dark to-beergam-black-blue" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-beergam-orange/20 via-transparent to-beergam-orange/10 animate-pulse" />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-beergam-orange/10 border border-beergam-orange/20 mb-8">
          <span className="text-beergam-orange text-sm font-medium">
            O ERP de e-commerce que você precisa
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-bold text-beergam-white mb-6 leading-tight">
          Gerencie seu e-commerce
          <br />
          <span className="text-4xl! font-bold lg:text-4xl! xl:text-5xl! 2xl:text-6xl! bg-linear-to-r from-beergam-orange to-beergam-orange-dark bg-clip-text text-transparent">
            com inteligência
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl! sm:text-2xl! text-beergam-gray-light max-w-3xl mx-auto mb-12 leading-relaxed">
          Simplifique seus processos, automatize suas vendas e expanda seu
          negócio com a plataforma mais completa para vendedores de e-commerce.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/registro"
            className="bg-beergam-orange/10 hover:bg-beergam-orange/20 text-beergam-orange font-semibold px-8 py-4 rounded-lg text-lg transition-all border border-white/20 hover:border-white/30"
          >
            Começar Agora
          </Link>
          <Link
            to="#features"
            className="bg-white/10 hover:bg-white/20 text-beergam-white font-semibold px-8 py-4 rounded-lg text-lg transition-all border border-white/20 hover:border-white/30"
          >
            Ver Funcionalidades
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-beergam-orange mb-2">
              2K+
            </div>
            <div className="text-beergam-gray-light">Vendedores ativos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-beergam-orange mb-2">
              1M+
            </div>
            <div className="text-beergam-gray-light">Pedidos processados</div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-beergam-orange/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-beergam-orange/5 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
}
