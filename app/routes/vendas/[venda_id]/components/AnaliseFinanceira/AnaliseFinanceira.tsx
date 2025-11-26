import React from "react";
import styles from "./AnaliseFinanceira.module.css";
import DetalhesPedido from "../DetalhesPedido/DetalhesPedido";
import AvisoProdutosNaoCadastrados from "../AvisoProdutosNaoCadastrados/AvisoProdutosNaoCadastrados";

interface AnaliseFinanceiraProps {
    valorTotalVenda: number;
    receitaBruta: number;
    envioVendedor: number;
    envioComprador: number;
    envioFinalVendedor: number;
    tarifaML: number;
    totalReceita: number;
    custoProduto: number;
    custoEmbalagem: number;
    custosExtras: number;
    impostos: number;
    lucroFinal: number;
    produtosNaoCadastrados?: Array<{ nome: string; sku: string | null }>;
    orderId?: string;
}

function AnaliseFinanceira({
    valorTotalVenda,
    receitaBruta,
    envioVendedor,
    envioComprador,
    envioFinalVendedor,
    tarifaML,
    totalReceita,
    custoProduto,
    custoEmbalagem,
    custosExtras,
    impostos,
    lucroFinal,
    produtosNaoCadastrados = [],
    orderId
}: AnaliseFinanceiraProps) {
    return (
        <div className={styles.analiseFinanceira}>
            <h2 className={styles.title}>Análise Financeira do Pedido</h2>

            {/* Receita */}
            <div className={styles.section}>
                <DetalhesPedido
                    titulo="Valor total da Venda"
                    hint=""
                    value={valorTotalVenda}
                />
                <DetalhesPedido
                    titulo="Receita Bruta"
                    hint=""
                    value={receitaBruta}
                />
                <DetalhesPedido
                    titulo="Envios - Vendedor"
                    hint="Custo de envio pago pelo vendedor"
                    value={-envioVendedor}
                    isCusto={true}
                />
                <DetalhesPedido
                    titulo="Envios - Comprador"
                    hint="Valor de envio pago pelo comprador"
                    value={envioComprador > 0 ? envioComprador : 0}
                />
                <DetalhesPedido
                    titulo="Valor de envio final para o vendedor"
                    hint="Custo final de envio"
                    value={-envioFinalVendedor}
                    isCusto={true}
                />
                <DetalhesPedido
                    titulo="Tarifa ML"
                    hint="Comissão descontada pelo ML"
                    value={-tarifaML}
                    isCusto={true}
                />
                <DetalhesPedido
                    titulo="Total Receita"
                    hint=""
                    value={totalReceita}
                    isHighlight={true}
                />
            </div>

            {/* Custos Internos */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Custos Internos Cadastrados</h3>
                <DetalhesPedido
                    titulo="Custo do Produto"
                    hint="Valor interno cadastrado no sistema"
                    value={-custoProduto}
                    isCusto={true}
                />
                <DetalhesPedido
                    titulo="Custo de Embalagem"
                    hint="Custos extras internos"
                    value={-custoEmbalagem}
                    isCusto={true}
                />
                <DetalhesPedido
                    titulo="Custos Extras"
                    hint="Outros custos internos"
                    value={-custosExtras}
                    isCusto={true}
                />
                <DetalhesPedido
                    titulo="Impostos"
                    hint="Informação interna da loja"
                    value={-impostos}
                    isCusto={true}
                />
            </div>

            {/* Aviso de produtos não cadastrados */}
            {produtosNaoCadastrados.length > 0 && (
                <AvisoProdutosNaoCadastrados produtos={produtosNaoCadastrados} />
            )}

            {/* Lucro Final */}
            <div className={styles.lucroFinal}>
                <DetalhesPedido
                    titulo="Lucro Final (Valor com Impostos e Custos)"
                    hint=""
                    value={lucroFinal}
                    isHighlight={true}
                />
            </div>

            {/* Action Button */}
            <a 
                href={`https://www.mercadolivre.com.br/vendas/${orderId || ''}/detalhe`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
            >
                <span>Ver no mercado livre sobre a venda</span>
                <i className="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    );
}

export default AnaliseFinanceira;

