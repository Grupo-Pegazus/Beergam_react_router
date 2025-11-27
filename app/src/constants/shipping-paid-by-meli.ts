export function getShippingPaidByLabel(shippingPaidBy: string | null | undefined): string {
  if (!shippingPaidBy) {
    return "N/A";
  }

  const normalizedValue = shippingPaidBy.toUpperCase().trim();
  
  const mapping: Record<string, string> = {
    BUYER: "Comprador",
    SELLER: "Vendedor",
    PARTIAL: "Parcial",
  };

  return mapping[normalizedValue] || shippingPaidBy;
}

