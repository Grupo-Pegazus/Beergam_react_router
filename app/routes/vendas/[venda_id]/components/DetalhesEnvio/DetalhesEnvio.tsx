import React from "react";
import styles from "./DetalhesEnvio.module.css";

interface DetalhesEnvioProps {
    children: React.ReactNode;
    title: string;
}

function DetalhesEnvio({ children, title }: DetalhesEnvioProps) {

    const textMap: Record<string, string> = {
        "Endereço": "Endereço de Entrega",
        "Produto": "Detalhes do Produto",
        "Entrega": "Detalhes da Entrega",
        "Informações Técnicas:": "Informações Técnicas:",
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <p className={styles.title}>{textMap[title]}</p>
            </div>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}

export default DetalhesEnvio;
