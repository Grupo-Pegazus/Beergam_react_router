import { MarketplaceStatusParse, MarketplaceOrderParseStatus } from "../typings";

interface StatusTagProps {
  status: MarketplaceStatusParse | MarketplaceOrderParseStatus;
  type: "parse" | "orders";
  className?: string;
}

export default function StatusTag({ status, type, className = "" }: StatusTagProps) {
  const getStatusConfig = () => {
    if (type === "parse") {
      switch (status as MarketplaceStatusParse) {
        case MarketplaceStatusParse.PENDING:
          return {
            text: "Conta pendente de processamento",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
            borderColor: "border-yellow-200"
          };
        case MarketplaceStatusParse.PROCESSING:
          return {
            text: "Conta em processamento",
            bgColor: "bg-blue-100",
            textColor: "text-blue-800",
            borderColor: "border-blue-200"
          };
        case MarketplaceStatusParse.COMPLETED:
          return {
            text: "Conta processada",
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            borderColor: "border-green-200"
          };
        case MarketplaceStatusParse.ERROR:
          return {
            text: "Erro",
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            borderColor: "border-red-200"
          };
      }
    } else {
      switch (status as MarketplaceOrderParseStatus) {
        case MarketplaceOrderParseStatus.NONE:
          return {
            text: "Sem pedidos",
            bgColor: "bg-gray-100",
            textColor: "text-gray-800",
            borderColor: "border-gray-200"
          };
        case MarketplaceOrderParseStatus.FIFTEEN_DAYS:
          return {
            text: "15 dias de pedidos processados",
            bgColor: "bg-orange-100",
            textColor: "text-orange-800",
            borderColor: "border-orange-200"
          };
        case MarketplaceOrderParseStatus.COMPLETED:
          return {
            text: "Pedidos processados",
            bgColor: "bg-green-100",
            textColor: "text-green-800",
            borderColor: "border-green-200"
          };
      }
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      {config.text}
    </span>
  );
}
