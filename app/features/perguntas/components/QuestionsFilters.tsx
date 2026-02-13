import { Stack } from "@mui/material";
import {
  FilterActions,
  FilterContainer,
  FilterSearchInput,
  FilterSelect,
  FilterDateRangePicker,
} from "~/src/components/filters";
import type { QuestionsFiltersState } from "../typings";

interface QuestionsFiltersProps {
  value: QuestionsFiltersState;
  onChange: (next: QuestionsFiltersState) => void;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Respondida", value: "ANSWERED" },
  { label: "Sem resposta", value: "UNANSWERED" }
];

export function QuestionsFilters({
  value,
  onChange,
  onSubmit,
  onReset,
  isSubmitting = false,
}: QuestionsFiltersProps) {
  const handleChange = (key: keyof QuestionsFiltersState, newValue: unknown) => {
    onChange({
      ...value,
      [key]: newValue,
      page: key === "page" ? (newValue as number) : 1,
    });
  };

  const sections = [
    <Stack
      key="search-section"
      direction={{ xs: "column", md: "row" }}
      spacing={3}
    >
      <div style={{ flex: 1 }} className="md:w-auto w-full">
        <FilterSearchInput
          value={value.text}
          onChange={(text) => handleChange("text", text)}
          label="Pesquisar pergunta"
          placeholder="Digite para buscar no texto da pergunta"
          fullWidth={true}
          widthType="full"
          onEnterPress={onSubmit}
        />
      </div>
      <div style={{ flex: 1 }} className="md:w-auto w-full">
        <FilterSearchInput
          label="ID do item"
          value={value.item_id}
          onChange={(text) => handleChange("item_id", text)}
          placeholder="Digite o ID do item"
          fullWidth={true}
          widthType="full"
          onEnterPress={onSubmit}
        />
      </div>
    </Stack>,
    <Stack
      key="filters-section"
      direction={{ xs: "column", md: "row" }}
      spacing={3}
    >
      <div style={{ flex: 1 }} className="md:w-auto w-full">
        <FilterSelect
          value={value.status}
          onChange={(newValue) => handleChange("status", newValue ?? "")}
          label="Status"
          options={STATUS_OPTIONS}
          defaultValue=""
          widthType="full"
        />
      </div>
    </Stack>,
    <div key="date-section" className="w-full max-w-sm">
      <FilterDateRangePicker
        label="Período"
        value={
          value.date_from && value.date_to
            ? { start: value.date_from, end: value.date_to }
            : null
        }
        onChange={(range) => {
          onChange({
            ...value,
            date_from: range.start,
            date_to: range.end,
            page: 1,
          });
        }}
        widthType="full"
      />
    </div>,
  ];

  return (
    <FilterContainer sections={sections}>
      <FilterActions
        onReset={onReset}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Aplicar filtros"
        resetLabel="Limpar"
      />
    </FilterContainer>
  );
}

