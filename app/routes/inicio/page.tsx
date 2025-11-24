import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import Reputacao from "~/features/metricsAccount/components/Reputacao/Reputacao";
import ScheduleTimes from "~/features/metricsAccount/components/ScheduleTimes/ScheduleTimes";
import Visitas from "~/features/metricsAccount/components/Visitas/Visitas";
import MetricasCards from "~/features/anuncios/components/MetricasCards/MetricasCards";
import TopAnunciosVendidos from "~/features/anuncios/components/TopAnunciosVendidos/TopAnunciosVendidos";
import VendasResumo from "~/features/vendas/components/VendasResumo/VendasResumo";

export default function InicioPage() {
    return (
        <>
            <Section title="Geral da conta">
                <Grid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
                    <Reputacao />
                    <ScheduleTimes />
                </Grid>
            </Section>
            <Section title="Resumo de Vendas">
                <VendasResumo />
            </Section>
            <Section title="Resumo de Anúncios">
                <MetricasCards />
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