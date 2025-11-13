import type { ReactNode } from "react";
import { Divider, Paper, Stack } from "@mui/material";

export interface FilterContainerProps {
  children: ReactNode;
  sections?: Array<ReactNode>;
}

/**
 * Container base para filtros com estilo charmoso
 * Reutilizável e consistente em todo o sistema
 */
export function FilterContainer({
  children,
  sections,
}: FilterContainerProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        padding: { xs: 2, md: 3 },
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
        boxShadow: "0 20px 35px -25px rgba(15, 23, 42, 0.4)",
      }}
    >
      <Stack spacing={3}>
        {sections?.map((section, index) => (
          <div key={index}>
            {section}
            {index < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
          </div>
        ))}
        {children && (
          <>
            {sections && sections.length > 0 && <Divider />}
            {children}
          </>
        )}
      </Stack>
    </Paper>
  );
}

