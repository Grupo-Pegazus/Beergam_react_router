import styles from "./ProductSummary.module.css";

interface ProductSummaryProps {
    img: string;
    altImg: string;
    nome: string;
    sku: string;
    un: number;
    value: number;
    link: string;
}

function ProductSummary({ img, altImg, nome, sku, un, value, link }: ProductSummaryProps) {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.linkWrapper}>
            <div className={styles.productSummary}>
                <img className={styles.img} src={img} alt={altImg} />
                <div className={styles.info}>
                    <p className={styles.name}>{nome}</p>
                    <p className={styles.sku}>{sku}</p>
                    <div className={styles.uniValue}>
                        <p>{un} unidades</p>
                        <p>R${value} Uni.</p>
                    </div>
                </div>
            </div>
        </a>
    );
}

export default ProductSummary;
