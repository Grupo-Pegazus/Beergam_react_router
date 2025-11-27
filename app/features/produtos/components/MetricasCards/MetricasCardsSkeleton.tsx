import StatCard from "~/src/components/ui/StatCard";

export default function MetricasCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((index) => (
        <StatCard
          key={index}
          title="Carregando..."
          value="—"
          loading={true}
          variant="soft"
          color="slate"
        />
      ))}
    </div>
  );
}

