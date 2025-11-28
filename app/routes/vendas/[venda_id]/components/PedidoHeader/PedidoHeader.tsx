import { Chip } from "@mui/material";
import styles from "./PedidoHeader.module.css";

interface PedidoHeaderProps {
    packId?: string | null;
    totalItems: number;
    orderId: string;
    date: string;
    status: string;
    statusBackgroundColor?: string;
    statusColor?: string;
}

function PedidoHeader({ packId, totalItems, orderId, date, status, statusBackgroundColor, statusColor }: PedidoHeaderProps) {
    const isPack = packId && packId.trim() !== "";
    const titlePrefix = isPack ? "Compra de carrinho" : "Compra";
    const identifier = isPack ? packId : orderId;
    
    return (
        <div className={styles.header}>
            <div className={styles.mainInfo}>
                <h1 className={styles.title}>
                    {titlePrefix} #{identifier} | {totalItems} itens
                </h1>
                <div className={styles.tracking}>
                    {/* <span className={styles.orderId}>#{orderId}</span> */}
                    {/* <span className={styles.separator}>|</span> */}
                    <span className={styles.date}>Pedido realizado em {date}</span>
                    <span className={styles.separator}>|</span>
                    <Chip
                        label={status}
                        sx={{
                            height: 20,
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            backgroundColor: statusBackgroundColor || "#f3f4f6",
                            color: statusColor || "#374151",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default PedidoHeader;

