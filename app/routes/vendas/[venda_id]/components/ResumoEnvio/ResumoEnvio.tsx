import React from "react";
import styles from "./ResumoEnvio.module.css";
import LabelText from "../LabelText/LabelText";

interface ResumoEnvioProps {
    status: string;
    statusLabel: string;
    estimatedDelivery: string;
    trackingNumber: string;
}

function ResumoEnvio({ status, statusLabel, estimatedDelivery, trackingNumber }: ResumoEnvioProps) {
    return (
        <div className={styles.resumoEnvio}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {statusLabel}
                </h3>
            </div>
            <div className={styles.content}>
                <p className={styles.deliveryDate}> Estimativa de entrega: {estimatedDelivery}</p>
                <div className={styles.tracking}>
                    <LabelText 
                        label="Código de rastreamento" 
                        text={trackingNumber}
                        styleLabel={{ color: "#858585", fontSize: "0.9rem" }}
                        styleValue={{ color: "#11263c", fontWeight: "600" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ResumoEnvio;

