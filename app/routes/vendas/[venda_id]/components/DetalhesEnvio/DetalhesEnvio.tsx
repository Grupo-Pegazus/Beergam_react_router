import React from "react";
import styles from "./DetalhesEnvio.module.css";

type IconName = "endereco" | "produto" | "entrega" | "config";

interface DetalhesEnvioProps {
    icon: IconName;
    children: React.ReactNode;
}

function DetalhesEnvio({ icon, children }: DetalhesEnvioProps) {
    const iconMap: Record<IconName, React.JSX.Element> = {
        endereco: <i className="fa-solid fa-location-dot"></i>,
        produto: <i className="fa-solid fa-box"></i>,
        entrega: <i className="fa-solid fa-truck"></i>,
        config: <i className="fa-solid fa-cog"></i>,
    };

    const textMap: Record<IconName, string> = {
        endereco: "Endereço de Entrega",
        produto: "Detalhes do Produto",
        entrega: "Detalhes da Entrega",
        config: "Informações Técnicas:",
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span>{iconMap[icon]}</span>
                <p className={styles.title}>{textMap[icon]}</p>
            </div>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}

export default DetalhesEnvio;
