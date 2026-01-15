import { Chip } from "@mui/material";

interface PedidoHeaderProps {
  packId?: string | null;
  totalItems: number;
  orderId: string;
  date: string;
  status: string;
  statusBackgroundColor?: string;
  statusColor?: string;
}

function PedidoHeader({
  packId,
  totalItems,
  orderId,
  date,
  status,
  statusBackgroundColor,
  statusColor,
}: PedidoHeaderProps) {
  const isPack = packId && packId.trim() !== "";
  const titlePrefix = isPack ? "Compra de carrinho" : "Compra";
  const identifier = isPack ? packId : orderId;

  return (
    <div className="bg-beergam-section-background! rounded-[15px] p-5 px-6 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-beergam-typography-primary!">
          {titlePrefix} #{identifier} | {totalItems} itens
        </h1>
        <div className="flex items-center gap-2 text-beergam-typography-secondary! text-xs md:text-sm flex-wrap md:flex-nowrap">
          {/* <span className="font-semibold text-[#11263c]">#{orderId}</span> */}
          {/* <span className="text-[#d9d9d9]">|</span> */}
          <span className="text-beergam-typography-secondary!">
            Pedido realizado em {date}
          </span>
          <span className="text-beergam-section-border!">|</span>
          <Chip
            label={status}
            sx={{
              height: 20,
              fontSize: "0.8rem",
              fontWeight: 600,
              backgroundColor:
                statusBackgroundColor || "beergam-section-background!",
              color: statusColor || "beergam-typography-primary!",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PedidoHeader;
