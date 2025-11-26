import { useState } from "react";
import styles from "./Timeline.module.css";

interface TimelineItem {
    title: string;
    date: string;
    description: string;
    location?: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

function Timeline({items}: TimelineProps) {
    const [mostrarDetalhes, setMostrarDetalhes] = useState(true);

    function clickDetalhes() { setMostrarDetalhes(!mostrarDetalhes)}

    return (
        <div className={styles.timeline}>
            <div className={styles.container}>
                <div className={styles.line} />
                {items.map((item, index) => (
                    <div key={index} className={styles.item}>
                        <div className={styles.circle} />
                        <div className={styles.content}>
                            <strong className={styles.title}>{item.title}</strong>
                            <div
                                className={`${styles.descriptionWrapper} ${mostrarDetalhes ? styles.show : styles.hide}`}>
                                <div className={styles.description}>
                                    {item.date} | {item.description}
                                    {item.location && <span className={styles.location}> | {item.location}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className={styles.btnEsconder} onClick={clickDetalhes}>
                {mostrarDetalhes ? "Esconder detalhes" : "Mostrar detalhes"}
            </button>
        </div>
    );
};

export default Timeline;
