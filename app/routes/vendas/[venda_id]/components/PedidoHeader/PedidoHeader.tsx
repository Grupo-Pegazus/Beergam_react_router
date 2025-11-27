import styles from "./PedidoHeader.module.css";

interface PedidoHeaderProps {
    packId?: string | null;
    totalItems: number;
    orderId: string;
    date: string;
    status: string;
}

function PedidoHeader({ packId, totalItems, orderId, date, status }: PedidoHeaderProps) {
    const isPack = packId && packId.trim() !== "";
    const titlePrefix = isPack ? "Compra de carrinho" : "Compra";
    const identifier = isPack ? packId : orderId;
    
    return (
        <div className={styles.header}>
            <div className={styles.mainInfo}>
                <h1 className={styles.title}>
                    {titlePrefix} #{identifier} | + {totalItems} itens
                </h1>
                <div className={styles.tracking}>
                    {/* <span className={styles.orderId}>#{orderId}</span> */}
                    {/* <span className={styles.separator}>|</span> */}
                    <span className={styles.date}>Pedido realizado em {date}</span>
                    <span className={styles.separator}>|</span>
                    <span className={styles.status}>{status}</span>
                </div>
            </div>
        </div>
    );
}

export default PedidoHeader;

