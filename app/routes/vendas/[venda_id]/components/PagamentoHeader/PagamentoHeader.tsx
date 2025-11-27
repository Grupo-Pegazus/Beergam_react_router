import React from "react";
import styles from "./PagamentoHeader.module.css";

interface PagamentoHeaderProps {
    paymentId: string;
    date: string;
    status: string;
}

function PagamentoHeader({ paymentId, date, status }: PagamentoHeaderProps) {
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>Pagamento aprovado</h2>
            <div className={styles.info}>
                <span className={styles.paymentId}>#{paymentId}</span>
                <span className={styles.separator}>|</span>
                <span className={styles.date}>{date}</span>
                <span className={styles.separator}>|</span>
                <span className={styles.status}>{status}</span>
            </div>
        </div>
    );
}

export default PagamentoHeader;

