export const getStockStatus = (quantity: number, minimum: number) => {
  if (quantity === 0) {
    return {
      label: "Zerado",
      color: "error" as const,
      bgColor: "#fee2e2",
      textColor: "#991b1b",
    };
  }
  if (quantity <= minimum) {
    return {
      label: "Baixo",
      color: "warning" as const,
      bgColor: "#fef3c7",
      textColor: "#92400e",
    };
  }
  return {
    label: "OK",
    color: "success" as const,
    bgColor: "#d1fae5",
    textColor: "#065f46",
  };
};
