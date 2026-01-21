import { Collapse, Stack } from "@mui/material";
import { useState } from "react";
import {
    FilterActions,
    FilterSearchInput,
    FilterSelect,
} from "~/src/components/filters";
import Svg from "~/src/assets/svgs/_index";
import type { ClientsFiltersState } from "../../typings";

interface ClientsFiltersProps {
    value: ClientsFiltersState;
    onChange: (next: ClientsFiltersState) => void;
    onSubmit: () => void;
    onReset: () => void;
    isSubmitting?: boolean;
}

const HAS_CLAIMS_OPTIONS = [
    { label: "Todos", value: "" },
    { label: "Com reclamações", value: "true" },
    { label: "Sem reclamações", value: "false" },
];

function hasActiveFilters(filters: ClientsFiltersState): boolean {
    return !!(
        filters.client_id ||
        filters.receiver_name ||
        filters.receiver_document ||
        filters.has_claims
    );
}

export function ClientsFilters({
    value,
    onChange,
    onSubmit,
    onReset,
    isSubmitting = false,
}: ClientsFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasFilters = hasActiveFilters(value);

    const handleChange = (key: keyof ClientsFiltersState, newValue: unknown) => {
        onChange({
            ...value,
            [key]: newValue,
        });
    };

    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleReset = () => {
        onReset();
        setIsExpanded(false);
    };

    return (
        <div className="bg-beergam-section-background border border-beergam-section-border rounded-xl shadow-sm overflow-hidden">
            {/* Header clicável */}
            <div
                onClick={handleToggle}
                className="w-full flex items-center justify-between p-3 hover:bg-beergam-section-background/50 transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggle();
                    }
                }}
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-beergam-typography-primary">
                        Filtrar Clientes
                    </h3>
                    {hasFilters && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-beergam-primary text-white rounded-full">
                            {[
                                value.client_id && "ID",
                                value.receiver_name && "Nome",
                                value.receiver_document && "Doc",
                                value.has_claims && "Reclamações",
                            ]
                                .filter(Boolean)
                                .length}
                        </span>
                    )}
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggle();
                    }}
                    className="flex items-center justify-center"
                    style={{
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease-in-out",
                    }}
                >
                    <Svg.chevron
                        tailWindClasses="h-5 w-5 text-beergam-typography-secondary"
                    />
                </div>
            </div>

            {/* Conteúdo expansível */}
            <Collapse in={isExpanded} timeout={300}>
                <div className="px-3 pb-3 space-y-3">
                    <Stack direction="column" spacing={2.5}>
                        <div className="w-full">
                            <FilterSearchInput
                                value={value.client_id}
                                onChange={(text) => handleChange("client_id", text)}
                                label="ID do Cliente"
                                placeholder="Digite o ID do cliente"
                                fullWidth={true}
                                widthType="full"
                                onEnterPress={onSubmit}
                            />
                        </div>
                        <div className="w-full">
                            <FilterSelect
                                value={value.has_claims}
                                onChange={(newValue) => handleChange("has_claims", newValue ?? "")}
                                label="Reclamações"
                                options={HAS_CLAIMS_OPTIONS}
                                defaultValue=""
                                widthType="full"
                            />
                        </div>
                        <div className="w-full">
                            <FilterSearchInput
                                value={value.receiver_name}
                                onChange={(text) => handleChange("receiver_name", text)}
                                label="Nome do Recebedor"
                                placeholder="Digite o nome do recebedor"
                                fullWidth={true}
                                widthType="full"
                                onEnterPress={onSubmit}
                            />
                        </div>
                        <div className="w-full">
                            <FilterSearchInput
                                value={value.receiver_document}
                                onChange={(text) => handleChange("receiver_document", text)}
                                label="Documento"
                                placeholder="CPF/CNPJ"
                                fullWidth={true}
                                widthType="full"
                                onEnterPress={onSubmit}
                            />
                        </div>
                    </Stack>
                    <div className="pt-1">
                        <FilterActions
                            onSubmit={onSubmit}
                            onReset={handleReset}
                            isSubmitting={isSubmitting}
                            submitLabel="Pesquisar"
                            resetLabel="Limpar filtros"
                        />
                    </div>
                </div>
            </Collapse>
        </div>
    );
}
