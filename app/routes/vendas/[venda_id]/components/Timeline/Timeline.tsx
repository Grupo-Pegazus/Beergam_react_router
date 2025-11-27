import { useState, useMemo } from "react";
import styles from "./Timeline.module.css";

interface TimelineItem {
    title: string;
    date: string;
    description: string;
    location?: string;
}

interface GroupedTimelineItem {
    title: string;
    items: TimelineItem[];
}

interface TimelineProps {
    items: TimelineItem[];
}

function Timeline({items}: TimelineProps) {
    const [mostrarDetalhes, setMostrarDetalhes] = useState(true);

    function clickDetalhes() { setMostrarDetalhes(!mostrarDetalhes)}

    // Agrupar itens por título
    const groupedItems = useMemo(() => {
        const groups: GroupedTimelineItem[] = [];
        const titleMap = new Map<string, TimelineItem[]>();

        items.forEach(item => {
            if (!titleMap.has(item.title)) {
                titleMap.set(item.title, []);
            }
            titleMap.get(item.title)!.push(item);
        });

        titleMap.forEach((groupItems, title) => {
            groups.push({
                title,
                items: groupItems
            });
        });

        return groups;
    }, [items]);

    return (
        <div className={styles.timeline}>
            <div className={styles.container}>
                <div className={styles.line} />
                {groupedItems.map((group, groupIndex) => (
                    <div key={groupIndex} className={styles.item}>
                        <div className={styles.circle} />
                        <div className={styles.content}>
                            <strong className={styles.title}>{group.title}</strong>
                            <div
                                className={`${styles.descriptionWrapper} ${mostrarDetalhes ? styles.show : styles.hide}`}>
                                {group.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className={styles.description}>
                                        {item.date} | {item.description}
                                        {item.location && <span className={styles.location}> | {item.location}</span>}
                                    </div>
                                ))}
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
