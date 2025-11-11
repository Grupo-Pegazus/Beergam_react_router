import type { Route } from ".react-router/types/app/routes/inicio/+types/route";
import Reputacao from "~/features/metricsAccount/components/Reputacao/Reputacao";
import ScheduleTimes from "~/features/metricsAccount/components/ScheduleTimes/ScheduleTimes";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import Visitas from "~/features/metricsAccount/components/Visitas/Visitas";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Início" },
    { name: "description", content: "Início" },
  ];
}

export default function Inicio() {
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
  );
}
