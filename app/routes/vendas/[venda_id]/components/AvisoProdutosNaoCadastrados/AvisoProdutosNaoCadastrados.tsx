import Svg from "~/src/assets/svgs/_index";
import { useCensorship } from "~/src/components/utils/Censorship/CensorshipContext";
import { TextCensored } from "~/src/components/utils/Censorship/TextCensored";

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
    <div className="bg-beergam-yellow/10 border border-beergam-yellow/50 border-l-4 border-l-beergam-yellow! rounded-lg p-4 my-6">
      <div className="flex items-center gap-2 mb-2">
        {/* <i className="fa-solid fa-triangle-exclamation text-beergam-yellow! text-2xl"></i> */}
        <Svg.warning_circle tailWindClasses="h-6 w-6 text-beergam-yellow!" />
        <h4 className="text-white">
          Foram detectados produtos não cadastrados no sistema interno.
        </h4>
      </div>
      <p className="text-beergam-white! text-sm mb-4 leading-6">
        Os cálculos de métricas e custos podem estar imprecisos. Para cadastrar
        os produtos, acesse a seção de Cadastro de Produtos.
      </p>
      <div className="mt-3">
        <h4 className="text-[0.95rem] font-semibold text-white mb-2">
          Produtos não cadastrados:
        </h4>
        {produtos.map((produto, index) => (
          <div
            key={index}
            className="bg-beergam-menu-background flex flex-col gap-2 p-3 rounded-md mb-2 [&_strong]:text-beergam-yellow!"
          >
            <p className="text-beergam-white!">
              <strong>Produto:</strong>{" "}
              {censored ? (
                <TextCensored
                  className="text-beergam-white!"
                  censorshipKey="vendas_orders_list_details"
                >
                  {produto.nome}
                </TextCensored>
              ) : (
                produto.nome
              )}
            </p>
            {produto.sku && (
              <p className="text-beergam-white!">
                <strong>SKU:</strong>{" "}
                {censored ? (
                  <TextCensored
                    className="text-beergam-white!"
                    censorshipKey="vendas_orders_list_details"
                  >
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
