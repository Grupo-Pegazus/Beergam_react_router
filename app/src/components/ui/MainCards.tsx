import type { ReactNode } from "react";
import { Paper } from "@mui/material";

interface MainCardsProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    allowOverflow?: boolean;
}

export default function MainCards({ children, className, onClick, allowOverflow = false }: MainCardsProps) {
    return (
        <Paper
            className={`w-full min-w-0 ${allowOverflow ? "" : "overflow-hidden"} p-4 ${className || ""}`}
            sx={allowOverflow ? { overflow: "visible !important" } : undefined}
            onClick={onClick}
        >
            {children}
        </Paper>
    );
}
