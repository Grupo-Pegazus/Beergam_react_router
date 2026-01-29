import { Legend } from "recharts";
import type { LegendProps, Payload } from "recharts/types/component/DefaultLegendContent";
import { useChart } from "./ChartContainer";
import type { ChartLegendContentProps } from "./types";

/**
 * Conteúdo customizado da Legenda
 * 
 * Use dentro de um Recharts Legend component
 * 
 * @example
 * ```tsx
 * <Legend content={<ChartLegendContent />} />
 * <Legend content={<ChartLegendContent nameKey="browser" />} />
 * ```
 */
export function ChartLegendContent({
  nameKey,
  hideIcon = false,
  className = "",
  ...props
}: ChartLegendContentProps & Partial<LegendProps>) {
  const { config } = useChart();
  
  // Props do Recharts Legend
  const { payload } = props as LegendProps & { payload?: Payload[] };

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={`
        flex flex-wrap items-center justify-center gap-4 pt-3
        text-sm text-beergam-typography-secondary
        ${className}
      `}
    >
      {payload.map((item, index) => {
        const dataKey = String(item.dataKey || item.value);
        const configItem = config[dataKey] || config[nameKey || ""];
        
        const itemColor = item.color || configItem?.color || "var(--color-beergam-primary)";
        const itemName = configItem?.label || item.value || dataKey;
        const Icon = configItem?.icon;

        return (
          <div
            key={`legend-item-${index}`}
            className="flex items-center gap-1.5"
          >
            {!hideIcon && (
              Icon ? (
                <Icon className="h-3 w-3" style={{ color: itemColor }} />
              ) : (
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: itemColor }}
                />
              )
            )}
            <span>{itemName}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Componente Legend pré-configurado com estilos Beergam
 * 
 * Wrapper do Recharts Legend com configurações padrão
 * 
 * @example
 * ```tsx
 * <ChartLegend content={<ChartLegendContent />} />
 * ```
 */
export function ChartLegend(props: LegendProps) {
  return (
    <Legend
      verticalAlign="bottom"
      wrapperStyle={{ paddingTop: "12px" }}
      {...props}
    />
  );
}

export default ChartLegend;
