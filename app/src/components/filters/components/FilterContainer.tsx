import { Divider, Paper, Stack } from "@mui/material";
import type { ReactNode } from "react";

export interface FilterContainerProps {
  children: ReactNode;
  sections?: Array<ReactNode>;
}

/**
 * Container base para filtros com estilo charmoso
 * Reutilizável e consistente em todo o sistema
 */
export function FilterContainer({ children, sections }: FilterContainerProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        padding: { xs: 2, md: 3 },
        mb: 4,
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
