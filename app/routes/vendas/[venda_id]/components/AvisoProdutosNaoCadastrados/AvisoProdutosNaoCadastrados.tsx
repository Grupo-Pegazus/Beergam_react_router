import { useCensorship } from "~/src/components/utils/Censorship/CensorshipContext";
import { TextCensored } from "~/src/components/utils/Censorship/TextCensored";
import styles from "./AvisoProdutosNaoCadastrados.module.css";

interface ProdutoNaoCadastrado {
  nome: string;
  sku: string | null;
}

interface AvisoProdutosNaoCadastradosProps {
  produtos: ProdutoNaoCadastrado[];
}

function AvisoProdutosNaoCadastrados({
  produtos,
}: AvisoProdutosNaoCadastradosProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored("vendas_orders_list_details");
  return (
    <div className={styles.aviso}>
      <div className={styles.header}>
        <i className="fa-solid fa-triangle-exclamation"></i>
        <h3 className={styles.title}>
          Atenção! Foram detectados produtos não cadastrados no sistema interno.
        </h3>
      </div>
      <p className={styles.description}>
        Os cálculos de métricas e custos podem estar imprecisos. Para cadastrar
        os produtos, acesse a seção de Cadastro de Produtos.
      </p>
      <div className={styles.produtosList}>
        <h4 className={styles.produtosTitle}>Produtos não cadastrados:</h4>
        {produtos.map((produto, index) => (
          <div key={index} className={styles.produtoItem}>
            <p className={styles.produtoNome}>
              <strong>Produto:</strong>{" "}
              {censored ? (
                <TextCensored censorshipKey="vendas_orders_list_details">
                  {produto.nome}
                </TextCensored>
              ) : (
                produto.nome
              )}
            </p>
            {produto.sku && (
              <p className={styles.produtoSku}>
                <strong>SKU:</strong>{" "}
                {censored ? (
                  <TextCensored censorshipKey="vendas_orders_list_details">
                    {produto.sku}
                  </TextCensored>
                ) : (
                  produto.sku
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvisoProdutosNaoCadastrados;
