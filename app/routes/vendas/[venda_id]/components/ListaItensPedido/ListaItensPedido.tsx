import React from "react";
import styles from "./ListaItensPedido.module.css";

interface ItemPedido {
    title: string;
    unit_price: number;
    quantity: number;
}

interface ListaItensPedidoProps {
    items: ItemPedido[];
}

function ListaItensPedido({ items }: ListaItensPedidoProps) {
    return (
        <div className={styles.lista}>
            <h3 className={styles.title}>Itens do Pedido</h3>
            <div className={styles.items}>
                {items.map((item, index) => (
                    <div key={index} className={styles.item}>
                        <p className={styles.itemTitle}>{item.title}</p>
                        <div className={styles.itemInfo}>
                            <span className={styles.price}>
                                {item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                            <span className={styles.quantity}>({item.quantity} Unidade{item.quantity > 1 ? 's' : ''})</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListaItensPedido;

