import React from "react";
import styles from "./AvisoProdutosNaoCadastrados.module.css";

interface ProdutoNaoCadastrado {
    nome: string;
    sku: string | null;
}

interface AvisoProdutosNaoCadastradosProps {
    produtos: ProdutoNaoCadastrado[];
}

function AvisoProdutosNaoCadastrados({ produtos }: AvisoProdutosNaoCadastradosProps) {
    return (
        <div className={styles.aviso}>
            <div className={styles.header}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <h3 className={styles.title}>Atenção! Foram detectados produtos não cadastrados no sistema interno.</h3>
            </div>
            <p className={styles.description}>
                Os cálculos de métricas e custos podem estar imprecisos. Para cadastrar os produtos, acesse a seção de Cadastro de Produtos.
            </p>
            <div className={styles.produtosList}>
                <h4 className={styles.produtosTitle}>Produtos não cadastrados:</h4>
                {produtos.map((produto, index) => (
                    <div key={index} className={styles.produtoItem}>
                        <p className={styles.produtoNome}>
                            <strong>Produto:</strong> {produto.nome}
                        </p>
                        {produto.sku && (
                            <p className={styles.produtoSku}>
                                <strong>SKU:</strong> {produto.sku}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvisoProdutosNaoCadastrados;

