import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import Reputacao from "~/features/metricsAccount/components/Reputacao/Reputacao";
import ScheduleTimes from "~/features/metricsAccount/components/ScheduleTimes/ScheduleTimes";
import Visitas from "~/features/metricsAccount/components/Visitas/Visitas";
import AnunciosMetricasCards from "~/features/anuncios/components/MetricasCards/MetricasCards";
import TopAnunciosVendidos from "~/features/anuncios/components/TopAnunciosVendidos/TopAnunciosVendidos";
import VendasResumo from "~/features/vendas/components/VendasResumo/VendasResumo";
import HomeSummary from "~/features/summary/components/HomeSummary";
import ProdutosMetricasCards from "~/features/produtos/components/MetricasCards/MetricasCards";
import QuestionsOverviewHome from "~/features/perguntas/components/QuestionsOverviewHome";

export default function InicioPage() {
    return (
        <>
            <Section title="Resumo Geral">
                <HomeSummary />
            </Section>
            <Section title="Geral da conta">
                <Grid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
                    <Reputacao />
                    <ScheduleTimes />
                </Grid>
            </Section>
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
            <Section title="Resumo de Produtos">
                <ProdutosMetricasCards />
            </Section>
            <Section title="Perguntas e SLA">
                <QuestionsOverviewHome />
            </Section>
            <Section title="Resumo de Anúncios">
                <AnunciosMetricasCards />
            </Section>
            <Section title="Top Anúncios Vendidos">
                <TopAnunciosVendidos />
            </Section>
            <Section title="Visitas na conta">
                <Grid cols={{ base: 1 }}>
                    <Visitas />
                </Grid>
            </Section>
        </>
    )
}