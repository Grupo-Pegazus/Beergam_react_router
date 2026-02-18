import StatCard from "~/src/components/ui/StatCard";
import Svg from "~/src/assets/svgs/_index";

export default function VisitasSkeleton() {
  return (
    <StatCard
      icon={<Svg.graph tailWindClasses="w-5 h-5 text-blue-600" />}
      title="Visitas"
      value="—"
      loading={true}
    >
      <div className="mt-4 h-48 bg-beergam-mui-paper rounded-lg animate-pulse" />
    </StatCard>
  );
}

