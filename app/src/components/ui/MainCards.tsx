import type { ReactNode } from "react";
import { Paper } from "@mui/material";

interface MainCardsProps {
    children: ReactNode;
    className?: string;
}

export default function MainCards({ children, className }: MainCardsProps) {
    return (
        <Paper className={`w-full min-w-0 overflow-hidden ${className || ""}`}>
            {children}
        </Paper>
    );
}
