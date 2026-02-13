import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";

export type ChatType = "pos_venda" | "reclamacao" | "mediacao";

export interface ChatHeaderProps {
    activeType?: ChatType;
    onTypeChange?: (type: ChatType) => void;
    hasClaims?: boolean;
    /** Caminho para voltar (ex: /interno/atendimento/chat). Usa Link para responder no 1º toque no mobile. */
    backToPath?: string;
}

const CHAT_TYPES: { value: ChatType; label: string }[] = [
    { value: "pos_venda", label: "Pós-venda" },
    { value: "reclamacao", label: "Reclamação" },
    { value: "mediacao", label: "Mediação" },
];

export default function ChatHeader({
    activeType = "pos_venda",
    onTypeChange,
    hasClaims = false,
    backToPath,
}: ChatHeaderProps) {
    const getValidActiveType = (type: ChatType): ChatType => {
        if (!hasClaims && (type === "reclamacao" || type === "mediacao")) {
            return "pos_venda";
        }
        return type;
    };

    const [currentType, setCurrentType] = useState<ChatType>(getValidActiveType(activeType));

    useEffect(() => {
        const validType = getValidActiveType(activeType);
        setCurrentType(validType);
        // Se o tipo foi ajustado, notifica o componente pai
        if (validType !== activeType) {
            onTypeChange?.(validType);
        }
    }, [activeType, hasClaims, onTypeChange]);

    const handleChange = (_event: React.SyntheticEvent, newValue: ChatType) => {
        setCurrentType(newValue);
        onTypeChange?.(newValue);
    };

    return (
        <div className="border-b border-beergam-section-border bg-beergam-section-background w-full flex flex-col">
            {backToPath && (
                <div className="shrink-0 flex items-center px-3 py-2.5 border-b border-beergam-section-border/50 bg-beergam-section-background/30">
                    <Link
                        to={backToPath}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-beergam-primary text-white font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-opacity touch-manipulation no-underline"
                        aria-label="Voltar para lista de clientes"
                    >
                        <Svg.arrow_uturn_left width={20} height={20} tailWindClasses="shrink-0" />
                        <span>Voltar</span>
                    </Link>
                </div>
            )}
            <div className="flex-1 min-w-0 px-2">
            <Tabs
                value={currentType}
                onChange={handleChange}
                variant="fullWidth"
                sx={{
                    width: "100%",
                    minHeight: 48,
                    "& .MuiTabs-flexContainer": {
                        display: "flex !important",
                        flexDirection: "row",
                        gap: "4px",
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: "var(--color-beergam-primary)",
                        height: 3,
                    },
                    "& .MuiTab-root": {
                        minHeight: 48,
                    },
                }}
            >
                {CHAT_TYPES.map((type) => {
                    // Desabilita reclamação e mediação se o cliente não tiver claims
                    const isDisabled = (type.value === "reclamacao" || type.value === "mediacao") && !hasClaims;
                    if (isDisabled) {
                        return null;
                    }
                    return (
                        <Tab
                            key={type.value}
                            label={type.label}
                            value={type.value}
                            sx={{
                                color: "var(--color-beergam-typography-secondary)",
                                textTransform: "none",
                                fontWeight: 500,
                                fontSize: "0.875rem",
                                minHeight: 48,
                                whiteSpace: "nowrap",
                                flex: 1,
                                maxWidth: "none",
                                "&.Mui-selected": {
                                    color: "var(--color-beergam-primary)",
                                    fontWeight: 600,
                                },
                                "&:hover": {
                                    color: "var(--color-beergam-primary)",
                                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                                },
                            }}
                        />
                    );
                })}
            </Tabs>
            </div>
        </div>
    );
}
