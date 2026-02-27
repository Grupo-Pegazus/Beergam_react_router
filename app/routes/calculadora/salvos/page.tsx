import SavedCalculationsTable from "~/features/calculator/components/SavedCalculationsTable/SavedCalculationsTable";

export default function SavedCalculationsPage() {
  return (
    <>
      <p className="text-sm text-beergam-typography-secondary! mb-6">
        Acesse, edite e gerencie todos os seus cálculos salvos de precificação e importação
      </p>
      <SavedCalculationsTable />
    </>
  );
}
