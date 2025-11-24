export function formatCurrency(value: string | number | null | undefined, options?: { money?: boolean, percentage?: boolean }): string {
  if (value == null) return "R$ 0,00";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(numValue) || !Number.isFinite(numValue)) return "R$ 0,00";
  
  // Se percentage for true, retorna formato de porcentagem
  if (options?.percentage) {
    return `${numValue.toFixed(2)}%`;
  }
  
  // Padrão é money: true (formatação de moeda)
  const useMoney = options?.money !== false;
  if (useMoney) {
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  
  // Fallback: apenas número formatado
  return numValue.toLocaleString("pt-BR");
}