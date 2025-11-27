import React from "react";
import styles from "./DetalhesPedido.module.css";
import Hint from "~/src/components/utils/Hint";

interface DetalhesPedidoProps {
    titulo: string;
    hint: string;
    value: number;
    isCusto?: boolean;
    isHighlight?: boolean; // Para destacar Total Receita e Lucro Final
    style?: React.CSSProperties;
}

function DetalhesPedido({ titulo, hint, value, isCusto, isHighlight, style}: DetalhesPedidoProps) {
    // Se for custo, sempre mostra como negativo (vermelho)
    // Se o valor for negativo, mostra como negativo
    // Caso contrário, mostra como positivo (verde)
    const isNegative = value < 0 || (isCusto && value > 0);

    const valorFormatado = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return (
        <div className={`${styles.detalhesPedido} ${isHighlight ? styles.highlight : ""}`} style={style}>
            <div className={styles.header}>
                <p>{titulo}</p>
                {hint && <Hint message={hint} anchorSelect={titulo.toLocaleLowerCase() + "-tooltip"} />}
            </div>

            <p className={`${styles.value} ${isNegative ? styles.negativo : styles.positivo} ${isHighlight ? styles.highlightValue : ""} text-nowrap`}>
                {valorFormatado}
            </p>
        </div>
    );
}

export default DetalhesPedido;
