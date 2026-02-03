import type Svg from "../assets/svgs/_index";

export const getStatusOrderMeliInfo = (status: string | null | undefined) => {
    const normalizedStatus = status?.toLowerCase().replace(/\s+/g, "_") || "";
  
    const statusMap: Record<
      string,
      { label: string; backgroundColor: string; color: string; icon: keyof typeof Svg | "information_circle" }
    > = {
      confirmed: {
        label: "Confirmado",
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        icon: "check_circle",
      },
      paid: {
        label: "Pago",
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        icon: "check_circle",
      },
      partially_refunded: {
        label: "Parcialmente reembolsado",
        backgroundColor: "#fef3c7",
        color: "#92400e",
        icon: "currency_dollar",
      },
      ready_to_ship: {
        label: "Pronto para enviar",
        backgroundColor: "#fef3c7",
        color: "#92400e",
        icon: "dolly",
      },
      handling: {
        label: "Em processamento",
        backgroundColor: "#fef3c7",
        color: "#92400e",
        icon: "clock",
      },
      shipped: {
        label: "Enviado",
        backgroundColor: "#dbeafe",
        color: "#1e40af",
        icon: "dolly",
      },
      delivered: {
        label: "Entregue",
        backgroundColor: "#d1fae5",
        color: "#065f46",
        icon: "check_circle",
      },
      not_delivered: {
        label: "Não entregue",
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        icon: "x_circle",
      },
      cancelled: {
        label: "Cancelado",
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        icon: "x_circle",
      },
      pending: {
        label: "Pendente",
        backgroundColor: "#fef3c7",
        color: "#92400e",
        icon: "clock",
      },
      
    };
  
    return (
      statusMap[normalizedStatus] || {
        label: status || "Desconhecido",
        backgroundColor: "#f3f4f6",
        color: "#374151",
        icon: "information_circle",
      }
    );
  };