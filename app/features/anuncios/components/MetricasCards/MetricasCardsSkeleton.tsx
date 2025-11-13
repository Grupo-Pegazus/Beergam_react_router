import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";
import Grid from "~/src/components/ui/Grid";

export default function MetricasCardsSkeleton() {
  return (
    <Grid cols={{ base: 1, sm: 2, md: 2, lg: 4 }} gap={4}>
      <StatCard
        icon={<Svg.list tailWindClasses="w-5 h-5 text-blue-600" />}
        title="Categorias"
        value="—"
        loading={true}
        color="blue"
        variant="soft"
      />
      <StatCard
        icon={<Svg.bag tailWindClasses="w-5 h-5 text-blue-600" />}
        title="Total de anúncios"
        value="—"
        loading={true}
        color="blue"
        variant="soft"
      />
      <StatCard
        icon={<Svg.alert tailWindClasses="w-5 h-5 text-red-600" />}
        title="Anúncios com estoque baixo"
        value="—"
        loading={true}
        color="red"
        variant="soft"
      />
      <StatCard
        icon={<Svg.warning_circle tailWindClasses="w-5 h-5 text-green-600" />}
        title="Anúncios a melhorar"
        value="—"
        loading={true}
        color="green"
        variant="soft"
      />
    </Grid>
  );
}


