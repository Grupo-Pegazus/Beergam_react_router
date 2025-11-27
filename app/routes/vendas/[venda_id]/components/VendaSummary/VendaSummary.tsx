import styles from "./VendaSummary.module.css";

interface VendaSummaryProps {
    title: string;
    category: "ML" | "ME";
    id: string;
    date: string;
}

function VendaSummary({ title, category, id, date }: VendaSummaryProps) {
    const categoryStyle = category === "ML" ? styles.mlCategory : styles.meCategory;

    return (
        <div className={styles.card}>
            <p className={styles.title}>{title}</p>
            <div className={styles.info}>
                <span className={`${styles.category} ${categoryStyle}`}>
                    {category}
                </span>
                <span className={styles.divisor}>|</span>
                <p>{id}</p>
                <span className={styles.divisor}>|</span>
                <p>{date}</p>
            </div>
        </div>
    );
}

export default VendaSummary;
