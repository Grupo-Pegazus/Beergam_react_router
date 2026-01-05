import AnunciosMetricasCards from "~/features/anuncios/components/MetricasCards/MetricasCards";
import TopAnunciosVendidos from "~/features/anuncios/components/TopAnunciosVendidos/TopAnunciosVendidos";
import Reputacao from "~/features/metricsAccount/components/Reputacao/Reputacao";
import ScheduleTimes from "~/features/metricsAccount/components/ScheduleTimes/ScheduleTimes";
import Visitas from "~/features/metricsAccount/components/Visitas/Visitas";
import QuestionsOverviewHome from "~/features/perguntas/components/QuestionsOverviewHome";
import ProdutosMetricasCards from "~/features/produtos/components/MetricasCards/MetricasCards";
import HomeSummary from "~/features/summary/components/HomeSummary";
import VendasResumo from "~/features/vendas/components/VendasResumo/VendasResumo";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";
import { CensorshipWrapper } from "~/src/components/utils/Censorship";

export default function InicioPage() {
  return (
    <>
      <CensorshipWrapper controlChildren censorshipKey="home_summary">
        <Section title="Resumo Geral">
          <HomeSummary />
        </Section>
      </CensorshipWrapper>
      <Section title="Geral da conta">
        <Grid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
          <Reputacao />
          <ScheduleTimes />
        </Grid>
      </Section>
      <CensorshipWrapper controlChildren censorshipKey="vendas_resumo">
        <Section
          title="Resumo de Vendas"
          actions={
            <span className="text-xs text-slate-500">
              Dados dos últimos 90 dias
            </span>
          }
        >
          <VendasResumo />
        </Section>
      </CensorshipWrapper>
      <Section title="Resumo de Produtos">
        <ProdutosMetricasCards />
      </Section>
      <CensorshipWrapper controlChildren censorshipKey="perguntas_sla">
        <Section title="Perguntas e SLA">
          <QuestionsOverviewHome />
        </Section>
      </CensorshipWrapper>
      <CensorshipWrapper controlChildren censorshipKey="resumo_anuncios">
        <Section title="Resumo de Anúncios">
          <AnunciosMetricasCards />
        </Section>
      </CensorshipWrapper>
      <Section title="Top Anúncios Vendidos">
        <TopAnunciosVendidos />
      </Section>
      <Section title="Visitas na conta">
        <Grid cols={{ base: 1 }}>
          <Visitas />
        </Grid>
      </Section>
    </>
  );
}
