import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
export type ChatType = "pos_venda" | "reclamacao" | "mediacao";

export interface ChatHeaderProps {
    activeType?: ChatType;
    onTypeChange?: (type: ChatType) => void;
    hasClaims?: boolean;
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
        <div className="border-b border-beergam-section-border bg-beergam-section-background w-full">
            <Tabs
                value={currentType}
                onChange={handleChange}
                variant="fullWidth"
                sx={{
                    width: "100%",
                    "& .MuiTabs-flexContainer": {
                        display: "flex !important",
                        flexDirection: "row",
                    },
                    "& .MuiTabs-indicator": {
                        backgroundColor: "var(--color-beergam-primary)",
                        height: 3,
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
    );
}
