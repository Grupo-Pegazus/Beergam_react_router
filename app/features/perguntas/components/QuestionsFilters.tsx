import { Stack } from "@mui/material";
import {
  FilterActions,
  FilterContainer,
  FilterSearchInput,
  FilterSelect,
  FilterDatePicker,
} from "~/src/components/filters";
import type { QuestionsFiltersState } from "../typings";

interface QuestionsFiltersProps {
  value: QuestionsFiltersState;
  onChange: (next: QuestionsFiltersState) => void;
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting?: boolean;
}

const ANSWERED_OPTIONS = [
  { label: "Todas", value: "all" },
  { label: "Respondidas", value: "answered" },
  { label: "Pendentes", value: "unanswered" },
];

const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Respondida", value: "ANSWERED" },
  { label: "Sem resposta", value: "UNANSWERED" },
  { label: "Bloqueada", value: "BANNED" },
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
      key="search"
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems="center"
    >
      <div style={{ flex: 3 }}>
        <FilterSearchInput
          value={value.text}
          onChange={(text) => handleChange("text", text)}
          label="Pesquisar pergunta"
          placeholder="Digite para buscar no texto da pergunta"
        />
      </div>
      <div style={{ flex: 1 }}>
        <FilterSearchInput
          label="ID do item"
          value={value.item_id}
          onChange={(text) => handleChange("item_id", text)}
          placeholder="Digite o ID do item"
        />
      </div>
    </Stack>,
    <Stack
      key="selects"
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      alignItems="flex-end"
    >
      <div style={{ flex: 1 }}>
        <FilterSelect
          value={value.status}
          onChange={(newValue) => handleChange("status", newValue ?? "")}
          label="Status"
          options={STATUS_OPTIONS}
          defaultValue=""
        />
      </div>
      <div style={{ flex: 1 }}>
        <FilterSelect
          value={value.answered}
          onChange={(newValue) => handleChange("answered", newValue ?? "all")}
          label="Resposta"
          options={ANSWERED_OPTIONS}
          defaultValue="all"
        />
      </div>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ flex: 2 }}>
        <FilterDatePicker
          label="Data inicial"
          value={value.date_from ?? ""}
          onChange={(date) => handleChange("date_from", date ?? undefined)}
        />
        <FilterDatePicker
          label="Data final"
          value={value.date_to ?? ""}
          onChange={(date) => handleChange("date_to", date ?? undefined)}
        />
      </Stack>
      <div style={{ display: "flex", justifyContent: "flex-end", minWidth: 180 }}>
        <FilterActions
          onReset={onReset}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Aplicar filtros"
          resetLabel="Limpar"
        />
      </div>
    </Stack>,
  ];

  return <FilterContainer sections={sections}>{null}</FilterContainer>;
}

