import type { TooltipProps } from "recharts";
import { Tooltip } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useChart } from "./ChartContainer";
import type { ChartTooltipContentProps } from "./types";

/**
 * Indicador de cor do tooltip
 */
function TooltipIndicator({
  color,
  type = "dot",
}: {
  color: string;
  type?: "dot" | "line" | "dashed";
}) {
  if (type === "dot") {
    return (
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
    );
  }

  if (type === "line") {
    return (
      <span
        className="h-0.5 w-4 shrink-0"
        style={{ backgroundColor: color }}
      />
    );
  }

  // dashed
  return (
    <span
      className="h-0.5 w-4 shrink-0 border-t-2 border-dashed"
      style={{ borderColor: color }}
    />
  );
}

/**
 * Conteúdo customizado do Tooltip
 * 
 * Use dentro de um Recharts Tooltip component
 * 
 * @example
 * ```tsx
 * <Tooltip content={<ChartTooltipContent />} />
 * <Tooltip content={<ChartTooltipContent indicator="line" hideLabel />} />
 * ```
 */
export function ChartTooltipContent({
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  labelKey,
  nameKey,
  valueFormatter,
  className = "",
  ...props
}: ChartTooltipContentProps & Partial<TooltipProps<ValueType, NameType>>) {
  const { config } = useChart();
  
  // Props do Recharts Tooltip
  const { active, payload, label } = props as TooltipProps<ValueType, NameType>;

  if (!active || !payload?.length) {
    return null;
  }

  // Determina o label a exibir
  const displayLabel = labelKey && config[labelKey]?.label
    ? config[labelKey].label
    : label;

  return (
    <div
      className={`
        rounded-lg border border-beergam-input-border
        bg-beergam-section-background
        px-3 py-2 shadow-lg
        text-sm
        ${className}
      `}
    >
      {/* Label do tooltip */}
      {!hideLabel && displayLabel && (
        <p className="mb-1.5 font-semibold text-beergam-typography-primary">
          {displayLabel}
        </p>
      )}

      {/* Items do tooltip */}
      <div className="flex flex-col gap-1.5">
        {payload.map((item, index) => {
          const dataKey = String(item.dataKey || item.name);
          const configItem = config[dataKey] || config[nameKey || ""];
          
          const itemColor = item.color || configItem?.color || "var(--color-beergam-primary)";
          const itemName = configItem?.label || item.name || dataKey;
          const itemValue = valueFormatter 
            ? valueFormatter(item.value as number | string)
            : item.value;

          return (
            <div
              key={`tooltip-item-${index}`}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                {!hideIndicator && (
                  <TooltipIndicator color={itemColor} type={indicator} />
                )}
                <span className="text-beergam-typography-secondary">
                  {itemName}
                </span>
              </div>
              <span className="font-medium text-beergam-typography-primary tabular-nums">
                {String(itemValue)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Componente Tooltip pré-configurado com estilos Beergam
 * 
 * Wrapper do Recharts Tooltip com configurações padrão
 * 
 * @example
 * ```tsx
 * <ChartTooltip content={<ChartTooltipContent />} />
 * ```
 */
export function ChartTooltip(props: TooltipProps<ValueType, NameType>) {
  return (
    <Tooltip
      cursor={{ fill: "var(--color-beergam-primary)", opacity: 0.1 }}
      {...props}
    />
  );
}

export default ChartTooltip;
