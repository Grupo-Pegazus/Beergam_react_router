import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import Svg from "~/src/assets/svgs/_index";

export type ViewType = "list" | "card";

interface ViewToggleProps {
  listElement: React.ReactNode;
  cardElement: React.ReactNode;
  defaultView?: ViewType;
  onViewChange?: (view: ViewType) => void;
  className?: string;
}

/**
 * Componente que permite alternar entre visualização em lista (table) e cards
 * @param listElement - Elemento React que representa a visualização em lista/table
 * @param cardElement - Elemento React que representa a visualização em cards
 * @param defaultView - Visualização padrão ("list" ou "card")
 * @param onViewChange - Callback chamado quando a visualização é alterada
 * @param className - Classes CSS adicionais para o container
 */
export default function ViewToggle({
  listElement,
  cardElement,
  defaultView = "card",
  onViewChange,
  className = "",
}: ViewToggleProps) {
  const [view, setView] = useState<ViewType>(defaultView);

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: ViewType | null
  ) => {
    if (newView !== null) {
      setView(newView);
      onViewChange?.(newView);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex justify-end">
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="tipo de visualização"
          sx={{
            "& .MuiToggleButton-root": {
              padding: "8px 12px",
              bgcolor: "var(--color-beergam-section-background)",
              border: "1px solid var(--color-beergam-typography-secondary)",
              color: "var(--color-beergam-typography-secondary)",
              "&:hover": {
                color: "var(--color-beergam-primary)",
              },
              "&.Mui-selected": {
                bgcolor: "var(--color-beergam-primary)",
                color: "white",
                "&:hover": {
                  bgcolor: "var(--color-beergam-primary)",
                },
              },
            },
          }}
        >
          <ToggleButton
            className="flex items-center justify-center w-12 h-12"
            value="list"
            aria-label="visualização em lista"
          >
            <Svg.list_bullet />
          </ToggleButton>
          <ToggleButton
            className="flex items-center justify-center w-12 h-12"
            value="card"
            aria-label="visualização em cards"
          >
            <Svg.card_solid />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="flex-1">
        {view === "list" ? listElement : cardElement}
      </div>
    </div>
  );
}
