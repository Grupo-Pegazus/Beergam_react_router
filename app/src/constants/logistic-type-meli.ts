export function getLogisticTypeMeliInfo(logisticType: string) {
    const mapping: Record<
      string,
      { label: string; backgroundColor: string; color: string }
    > = {
      xd_drop_off: {
        label: "Agência",
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },
      fulfillment: {
        label: "FULL",
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      },
      flex: {
        label: "Flex",
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },
      cross_docking: {
        label: "Coleta",
        backgroundColor: "#f0fdf4",
        color: "#166534",
      },
      drop_off: {
        label: "Correios",
        backgroundColor: "#fce7f3",
        color: "#9f1239",
      },
      self_service: {
        label: "Flex",
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },
      not_specified: {
        label: "Não especificado",
        backgroundColor: "#f3f4f6",
        color: "#374151",
      },
    };

    if (!logisticType || logisticType.trim() === "") {
      return {
        label: "Não especificado",
        backgroundColor: "#f3f4f6",
        color: "#374151",
      };
    }

    return (
      mapping[logisticType] || {
        label: logisticType,
        backgroundColor: "#f3f4f6",
        color: "#374151",
      }
    );
  }