import React, { useState } from "react";
import styles from "./ProductPanel.module.css";

interface ProductPanelProps {
    index: number;
    mostrarIndice: boolean;
    img: string;
    altImg: string;
    productName: string;
    quantityCompact: number;
    sku: string;
    tipo: "Clássico" | "Premium";
    catalog: "Sim" | "Não";
    categ: string;
    mlb: string;
    price: number;
    cost: number;
    commission: number;
    taxes: number;
    style?: React.CSSProperties;
}

function ProductPanel({ index, mostrarIndice, img, altImg, productName, quantityCompact, sku, tipo, catalog, categ, mlb, price, cost, commission, taxes, style }: ProductPanelProps) {
    const [aberto, setAberto] = useState(true); // Abrir por padrão

    const toggleAberto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAberto(!aberto);
    };

    const handleHeaderClick = () => {
        setAberto(!aberto);
    };

    const quantidade = Number(quantityCompact);
    const precoUnitario = price;
    const totalCalculado = quantidade * precoUnitario;
    const lucroCalculado = (price - cost - commission - taxes) * quantidade;

    return (
        <div className={`${styles.productPanel}`} style={style}>
            <div className={styles.header} onClick={handleHeaderClick}>
                <div className={styles.headerLeft}>
                    {mostrarIndice && (
                        <div className={styles.productNumber}>#{index + 1}</div>
                    )}
                    <div className={styles.productImage}>
                        <img src={img} alt={altImg} />
                    </div>

                    <div className={styles.info}>
                        <p className={aberto ? styles.nomeProdutoAberto : styles.nomeProdutoFechado}>
                            {productName}
                        </p>

                        <div className={styles.infoInline}>
                            <p className={styles.sku}>{sku}</p>
                            <div className={styles.quantTotal}>
                                <p className={styles.quant}>{quantityCompact}x {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                <p className={styles.total}>
                                    = {totalCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    type="button"
                    className={`${styles.btnAbrir} ${aberto ? styles.rotate : ""}`} 
                    onClick={toggleAberto}
                >
                    <i className="fa-solid fa-chevron-down"></i>
                </button>
            </div>

            <div className={`${styles.contentInfo} ${aberto ? styles.show : ""}`}>
                <div className={styles.columnInfo}>
                    <p className={styles.titleInfo}>Informações do Produto</p>
                    <div className={styles.topicsInfo}>
                        <p>Tipo: <strong>{tipo}</strong></p>
                        <p>Catálago: <strong>{catalog}</strong></p>
                        <p>Categoria: <strong>{categ}</strong></p>
                        <p>MLB: <strong>{mlb}</strong></p>
                    </div>
                </div>

                <div className={styles.columnInfo}>
                    <p className={styles.titleInfo}>Valores Financeiros</p>
                    <div className={styles.topicsInfo}>
                        <p>Preço Unitário: <strong>{price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>

                        <p>Custo Produto: <strong>{cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>

                        <p>Comissão ML: <strong>{commission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>

                        <p>Impostos: <strong>{taxes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>

                        <div className={styles.lucro}>
                            <p>Lucro Item: <strong>{lucroCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPanel;
