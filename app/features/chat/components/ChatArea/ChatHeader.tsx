import { Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
export type ChatType = "pos_venda" | "reclamacao" | "mediacao";

export interface ChatHeaderProps {
    activeType?: ChatType;
    onTypeChange?: (type: ChatType) => void;
}

const CHAT_TYPES: { value: ChatType; label: string }[] = [
    { value: "pos_venda", label: "Pós-venda" },
    { value: "reclamacao", label: "Reclamação" },
    { value: "mediacao", label: "Mediação" },
];

export default function ChatHeader({
    activeType = "pos_venda",
    onTypeChange,
}: ChatHeaderProps) {
    const [currentType, setCurrentType] = useState<ChatType>(activeType);

    useEffect(() => {
        setCurrentType(activeType);
    }, [activeType]);

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
                    "& .MuiTab-root": {
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
                    },
                }}
            >
                {CHAT_TYPES.map((type) => (
                    <Tab key={type.value} label={type.label} value={type.value} />
                ))}
            </Tabs>
        </div>
    );
}
