import { CensorshipWrapper } from "~/src/components/utils/Censorship";
import AvisoProdutosNaoCadastrados from "../AvisoProdutosNaoCadastrados/AvisoProdutosNaoCadastrados";
import DetalhesPedido from "../DetalhesPedido/DetalhesPedido";

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
  orderId,
}: AnaliseFinanceiraProps) {
  return (
    <CensorshipWrapper censorshipKey="vendas_orders_list_details">
      <div className="bg-beergam-menu-background rounded-[15px] p-6 text-white border border-white/10">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          Análise Financeira do Pedido
        </h2>

        {/* Receita */}
        <div className="mb-6">
          <DetalhesPedido
            titulo="Valor total da Venda"
            hint=""
            value={valorTotalVenda}
            canBeCensored={true}
          />
          <DetalhesPedido
            canBeCensored={true}
            titulo="Receita Bruta"
            hint=""
            value={receitaBruta}
          />
          <DetalhesPedido
            titulo="Envios - Vendedor"
            hint="Custo de envio pago pelo vendedor"
            value={envioVendedor}
            isCusto={true}
            canBeCensored={true}
          />
          <DetalhesPedido
            titulo="Envios - Comprador"
            hint="Valor de envio pago pelo comprador"
            value={envioComprador > 0 ? envioComprador : 0}
          />
          <DetalhesPedido
            titulo="Valor de envio final para o vendedor"
            hint="Custo final de envio"
            value={envioFinalVendedor}
            isCusto={true}
          />
          <DetalhesPedido
            titulo="Tarifa ML"
            hint="Comissão descontada pelo ML"
            value={tarifaML}
            isCusto={true}
          />
          <DetalhesPedido
            titulo="Total Receita"
            hint=""
            value={totalReceita}
            isHighlight={true}
            canBeCensored={true}
          />
        </div>

        {/* Custos Internos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-[#d9d9d9] pb-2 border-b border-white/10">
            Custos Internos Cadastrados
          </h3>
          <DetalhesPedido
            titulo="Custo do Produto"
            hint="Valor interno cadastrado no sistema"
            value={custoProduto}
            isCusto={true}
            canBeCensored={true}
          />
          <DetalhesPedido
            titulo="Custo de Embalagem"
            hint="Custos extras internos"
            value={custoEmbalagem}
            isCusto={true}
            canBeCensored={true}
          />
          <DetalhesPedido
            titulo="Custos Extras"
            hint="Outros custos internos"
            value={custosExtras}
            isCusto={true}
            canBeCensored={true}
          />
          <DetalhesPedido
            titulo="Impostos"
            hint="Informação interna da loja"
            value={impostos}
            isCusto={true}
            canBeCensored={true}
          />
        </div>

        {/* Aviso de produtos não cadastrados */}
        {produtosNaoCadastrados.length > 0 && (
          <AvisoProdutosNaoCadastrados produtos={produtosNaoCadastrados} />
        )}

        {/* Lucro Final */}
        <div className="mt-6 pt-4 border-t-2 border-white/20">
          <DetalhesPedido
            titulo="Lucro Final (Valor com Impostos e Custos)"
            hint=""
            value={lucroFinal}
            isHighlight={true}
            canBeCensored={true}
          />
        </div>

        {/* Action Button */}
        <a
          href={`https://www.mercadolivre.com.br/vendas/${orderId || ""}/detalhe`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-5 mt-6 bg-[var(--color-beergam-orange)] text-white no-underline rounded-lg font-semibold transition-all duration-300 border-none cursor-pointer hover:bg-[var(--color-beergam-orange-dark)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(255,138,0,0.3)]"
        >
          <span>Ver no mercado livre sobre a venda</span>
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </a>
      </div>
    </CensorshipWrapper>
  );
}

export default AnaliseFinanceira;
