import { Stack } from "@mui/material";
import {
    FilterActions,
    FilterContainer,
    FilterSearchInput,
    FilterSelect,
    FilterDateRangePicker,
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
        // Seção única: Pesquisar, ID, Status e Reputação na mesma linha
        <Stack
            key="filters-section"
            direction={{ xs: "column", lg: "row" }}
            spacing={3}
            sx={{ flexWrap: "wrap" }}
        >
            <div className="flex-1 min-w-0 lg:min-w-[200px] w-full">
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
            <div className="flex-1 min-w-0 lg:min-w-[180px] w-full">
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
            <div className="flex-1 min-w-0 lg:min-w-[140px] w-full">
                <FilterSelect
                    value={value.status}
                    onChange={(newValue) => handleChange("status", newValue ?? "")}
                    label="Status"
                    options={STATUS_OPTIONS}
                    defaultValue=""
                    widthType="full"
                />
            </div>
            <div className="flex-1 min-w-0 lg:min-w-[180px] w-full">
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
