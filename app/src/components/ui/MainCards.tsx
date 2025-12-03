import type { ReactNode } from "react";
import { Paper } from "@mui/material";

interface MainCardsProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function MainCards({ children, className, onClick }: MainCardsProps) {
    return (
        <Paper className={`w-full min-w-0 overflow-hidden ${className || ""}`} onClick={onClick}>
            {children}
        </Paper>
    );
}
