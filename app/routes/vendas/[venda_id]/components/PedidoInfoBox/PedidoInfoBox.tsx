import styles from "./PedidoInfoBox.module.css";

interface PedidoInfoBoxProps {
    items: number;
    uniqueItems: number;
    totalRevenue: number;
}

function PedidoInfoBox({ items, uniqueItems, totalRevenue }: PedidoInfoBoxProps) {
    return (
        <div className={styles.pedidoInfoBox}>
            <div className={styles.headerPedido}>
                <i className="fa-solid fa-box" style={{ color: "var(--orange)" }}></i>
                <p className={styles.titlePedido}>Produtos do Pedido</p>
                <span className={styles.countPedidos}>({items} itens)</span>
            </div>

            <div className={styles.contentPedido}>
                <div className={styles.itemPedido}>
                    <p className={styles.titleItem}>Total de Itens:</p>
                    <p className={styles.contentItem}><strong>{items}</strong></p>
                </div>
                <div className={styles.itemPedido}>
                    <p className={styles.titleItem}>Produtos Únicos:</p>
                    <p className={styles.contentItem}><strong>{uniqueItems}</strong></p>
                </div>
                <div className={styles.itemPedido}>
                    <p className={styles.titleItem}>Receita Total:</p>
                    <p className={styles.contentItem}>
                        <strong>{totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PedidoInfoBox;