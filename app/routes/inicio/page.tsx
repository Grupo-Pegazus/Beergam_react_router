import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import Reputacao from "~/features/metricsAccount/components/Reputacao/Reputacao";
import ScheduleTimes from "~/features/metricsAccount/components/ScheduleTimes/ScheduleTimes";
import Visitas from "~/features/metricsAccount/components/Visitas/Visitas";

export default function InicioPage() {
    return (
        <>
            <Section title="Geral da conta">
                <Grid cols={{ base: 1, sm: 2, md: 3, lg: 4 }}>
                    <Reputacao />
                    <ScheduleTimes />
                </Grid>
            </Section>
            <Section title="Visitas na conta">
                <Grid cols={{ base: 1 }}>
                    <Visitas />
                </Grid>
            </Section>
        </>
    )
}