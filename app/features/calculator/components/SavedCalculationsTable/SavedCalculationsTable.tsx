import { Paper } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import { useDeleteSavedCalculation, useSavedCalculations } from "~/features/calculator/hooks";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { Fields } from "~/src/components/utils/_fields";
import type { ISavedCalculation } from "../../typings";

const ITEMS_PER_PAGE = 10;

type TypeFilter = "meli" | "shopee" | "importacao" | undefined;

const TYPE_FILTER_OPTIONS = [
  { value: null, label: "Todos" },
  { value: "meli", label: "Mercado Livre" },
  { value: "shopee", label: "Shopee" },
  { value: "importacao", label: "Importação" },
];

const TYPE_LABELS: Record<ISavedCalculation["type_calculator"], string> = {
  meli: "Mercado Livre",
  shopee: "Shopee",
  importacao: "Importação",
};

const TYPE_COLORS: Record<ISavedCalculation["type_calculator"], string> = {
  meli: "bg-yellow-500/20 text-yellow-600",
  shopee: "bg-orange-500/20 text-orange-600",
  importacao: "bg-blue-500/20 text-blue-600",
};

const CALC_PATHS: Record<ISavedCalculation["type_calculator"], string> = {
  meli: "/interno/calculadora",
  shopee: "/interno/calculadora",
  importacao: "/interno/calculadora/importacao_simplificada",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

interface RowProps {
  calculation: ISavedCalculation;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

function CalculationRow({ calculation, onDelete, isDeleting }: RowProps) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleOpen = () => {
    const path = CALC_PATHS[calculation.type_calculator];
    navigate(path, { state: { savedCalculation: calculation } });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(calculation.id);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <Paper
      component="div"
      className="grid col-span-full px-3 py-3 cursor-pointer hover:bg-beergam-section-background/60 transition-colors"
      style={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1" }}
      onClick={handleOpen}
    >
      {/* Foto + nome */}
      <div className="flex items-center gap-3 min-w-0">
        {calculation.photo_url ? (
          <img
            src={calculation.photo_url}
            alt={calculation.name}
            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-beergam-input-border"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-beergam-section-background border border-beergam-input-border shrink-0 flex items-center justify-center">
            <Svg.calculator tailWindClasses="w-5 h-5 text-beergam-gray" />
          </div>
        )}
        <span
          className="text-sm font-medium text-beergam-typography-primary truncate"
          title={calculation.name}
        >
          {calculation.name}
        </span>
      </div>

      {/* Marketplace */}
      <div className="flex items-center">
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_COLORS[calculation.type_calculator]}`}
        >
          {TYPE_LABELS[calculation.type_calculator]}
        </span>
      </div>

      {/* Data */}
      <div className="flex items-center">
        <span className="text-xs text-beergam-typography-secondary">
          {formatDate(calculation.updated_at ?? calculation.created_at)}
        </span>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleOpen}
          className="p-1.5 rounded text-beergam-gray hover:text-beergam-primary hover:bg-beergam-primary/10 transition-colors"
          aria-label="Abrir cálculo"
        >
          <Svg.arrow_long_right width={16} height={16} />
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          onBlur={() => setConfirmDelete(false)}
          disabled={isDeleting}
          className={`p-1.5 rounded transition-colors text-sm font-medium ${
            confirmDelete
              ? "bg-beergam-red/10 text-beergam-red px-2"
              : "text-beergam-gray hover:text-beergam-red hover:bg-beergam-red/10"
          }`}
          aria-label="Remover cálculo"
        >
          {confirmDelete ? "Confirmar?" : <Svg.trash width={16} height={16} />}
        </button>
      </div>
    </Paper>
  );
}

export default function SavedCalculationsTable() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(undefined);
  const { data, isLoading } = useSavedCalculations(typeFilter);
  const deleteCalculation = useDeleteSavedCalculation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const calculations = data?.data ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return calculations;
    return calculations.filter((c) => c.name.toLowerCase().includes(q));
  }, [calculations, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter((value || undefined) as TypeFilter);
    setSearch("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-beergam-section-background animate-pulse" />
        ))}
      </div>
    );
  }

  if (calculations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Svg.calculator tailWindClasses="w-12 h-12 text-beergam-gray/40" />
        <p className="text-sm font-medium text-beergam-typography-secondary">
          Nenhum cálculo salvo ainda
        </p>
        <p className="text-xs text-beergam-typography-secondary/60">
          Use o botão &quot;Salvar cálculo&quot; em qualquer calculadora para guardar seus resultados aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 w-full">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[180px] max-w-sm">
          <FilterSearchInput
            value={search}
            onChange={handleSearch}
            placeholder="Buscar por nome..."
            widthType="full"
            className="bg-beergam-mui-paper!"
          />
        </div>
        <Fields.select
          name="typeFilter"
          value={typeFilter ?? null}
          options={TYPE_FILTER_OPTIONS}
          onChange={(e) => handleTypeFilter(e.target.value)}
          widthType="fit"
        />
        <span className="text-xs text-beergam-typography-secondary ml-auto shrink-0">
          {filtered.length} {filtered.length === 1 ? "cálculo" : "cálculos"}
        </span>
      </div>

      {/* Tabela */}
      <div
        className="grid w-full gap-x-4 gap-y-1"
        style={{ gridTemplateColumns: "minmax(200px, 3fr) minmax(120px, 1fr) minmax(130px, 1fr) minmax(100px, auto)" }}
      >
        {/* Header */}
        <div
          className="col-span-full grid text-[10px] font-semibold text-beergam-typography-tertiary uppercase tracking-wide px-3 pb-1"
          style={{ gridTemplateColumns: "subgrid", gridColumn: "1 / -1" }}
        >
          <span>Nome</span>
          <span>Tipo de cálculo</span>
          <span>Atualizado em</span>
          <span />
        </div>

        {/* Linhas */}
        {paginated.map((calc) => (
          <CalculationRow
            key={calc.id}
            calculation={calc}
            onDelete={(id) => deleteCalculation.mutate(id)}
            isDeleting={deleteCalculation.isPending}
          />
        ))}
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={filtered.length}
        entityLabel="cálculos"
        onChange={setPage}
      />
    </div>
  );
}
