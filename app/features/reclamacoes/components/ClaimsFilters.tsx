import { Stack } from "@mui/material";
import {
    FilterActions,
    FilterContainer,
    FilterSearchInput,
    FilterSelect,
    FilterDatePicker,
} from "~/src/components/filters";
import type { ClaimsFiltersState } from "../typings";

interface ClaimsFiltersProps {
    value: ClaimsFiltersState;
    onChange: (next: ClaimsFiltersState) => void;
    onSubmit: () => void;
    onReset: () => void;
    isSubmitting?: boolean;
}

const STATUS_OPTIONS = [
    { label: "Todos", value: "" },
    { label: "Aberta", value: "opened" },
    { label: "Fechada", value: "closed" },
];

const AFFECTS_REPUTATION_OPTIONS = [
    { label: "Todos", value: "" },
    { label: "Afetou Reputação", value: "affected" },
    { label: "Não Afetou Reputação", value: "not_affected" },
];

export function ClaimsFilters({
    value,
    onChange,
    onSubmit,
    onReset,
    isSubmitting = false,
}: ClaimsFiltersProps) {
    const handleChange = (key: keyof ClaimsFiltersState, newValue: unknown) => {
        onChange({
            ...value,
            [key]: newValue,
            page: key === "page" ? (newValue as number) : 1,
        });
    };

    const sections = [
        // Primeira seção: Busca por texto e ID da reclamação
        <Stack
            key="search-section"
            direction={{ xs: "column", md: "row" }}
            spacing={3}
        >
            <div style={{ flex: 1 }} className="md:w-auto w-full">
                <FilterSearchInput
                    value={value.text}
                    onChange={(text) => handleChange("text", text)}
                    label="Pesquisar reclamação"
                    placeholder="Digite para buscar no motivo e mensagens"
                    fullWidth={true}
                    widthType="full"
                    onEnterPress={onSubmit}
                />
            </div>
            <div style={{ flex: 1 }} className="md:w-auto w-full">
                <FilterSearchInput
                    label="ID da reclamação"
                    value={value.claim_id}
                    onChange={(text) => handleChange("claim_id", text)}
                    placeholder="Digite o ID da reclamação"
                    fullWidth={true}
                    widthType="full"
                    onEnterPress={onSubmit}
                />
            </div>
        </Stack>,
        // Segunda seção: Status e Reputação
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
            <div style={{ flex: 1 }} className="md:w-auto w-full">
                <FilterSelect
                    value={value.affects_reputation}
                    onChange={(newValue) => handleChange("affects_reputation", newValue ?? "")}
                    label="Reputação"
                    options={AFFECTS_REPUTATION_OPTIONS}
                    defaultValue=""
                    widthType="full"
                />
            </div>
        </Stack>,
        // Terceira seção: Datas
        <Stack
            key="date-section"
            direction={{ xs: "column", md: "row" }}
            spacing={3}
        >
            <div style={{ flex: 1 }} className="md:w-auto w-full">
                <FilterDatePicker
                    label="Data inicial"
                    value={value.date_from ?? ""}
                    onChange={(date) => handleChange("date_from", date ?? undefined)}
                    widthType="full"
                />
            </div>
            <div style={{ flex: 1 }} className="md:w-auto w-full">
                <FilterDatePicker
                    label="Data final"
                    value={value.date_to ?? ""}
                    onChange={(date) => handleChange("date_to", date ?? undefined)}
                    widthType="full"
                />
            </div>
        </Stack>,
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
