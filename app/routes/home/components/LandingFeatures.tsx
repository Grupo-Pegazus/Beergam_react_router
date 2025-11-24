interface IFeature {
  title: string;
  description: string;
  icon: string;
}
const features: IFeature[] = [
  {
    title: "Controle de Estoque",
    description:
      "Sincronização automática com todas as lojas, alertas inteligentes de estoque baixo e geração automática de pedidos de compra.",
    icon: "📊",
  },
  {
    title: "Multi-marketplace",
    description:
      "Gerencie todas as suas vendas em um único lugar. Integração com os principais marketplaces do Brasil.",
    icon: "🛒",
  },
  {
    title: "Cálculo de Lucro",
    description:
      "Mantenha dados de lucro precisos com sincronização automática de liquidações e custos.",
    icon: "💰",
  },
  {
    title: "Controle de Colaboradores",
    description:
      "Reduza tarefas manuais e aumente a performance do seu colaborador. Fluxos otimizados para um time mais eficiente e focado em resultados.",
    icon: "👥",
  },
  {
    title: "Pesquisa de Produtos",
    description:
      "Pesquise produtos em todas as lojas de forma automática e eficiente, antes da concorrência.",
    icon: "🔍",
  },
  {
    title: "Sistema de SAC",
    description:
      "Gerencie suas reclamações e sugestões de forma eficiente e organizada.",
    icon: "💬",
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="py-24 bg-beergam-blue-primary-dark md:h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-beergam-white mb-4">
            Funcionalidades que fazem a diferença
          </h2>
          <p className="text-xl text-beergam-gray-light max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar seu e-commerce de forma
            profissional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-beergam-blue-lara/50 border border-white/10 rounded-xl p-6 hover:border-beergam-orange/50 transition-all hover:shadow-lg hover:shadow-beergam-orange/10"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-beergam-white mb-3">
                {feature.title}
              </h3>
              <p className="text-beergam-gray-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
