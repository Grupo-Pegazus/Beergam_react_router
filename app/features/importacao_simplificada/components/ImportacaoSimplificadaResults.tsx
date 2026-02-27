import type { ImportacaoSimplificadaResult } from "../typings";

interface ImportacaoSimplificadaResultsProps {
  result: ImportacaoSimplificadaResult | null;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatBrl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ImportacaoSimplificadaResults({
  result,
}: ImportacaoSimplificadaResultsProps) {
  if (!result) {
    return (
      <div className="sticky top-4 bg-beergam-menu-background rounded-[15px] p-6 text-white border border-white/10">
        <p className="text-sm text-beergam-typography-secondary">
          Preencha os campos e os resultados aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="sticky top-4 bg-beergam-menu-background rounded-[15px] p-6 text-white border border-white/10">
      <h3 className="text-base font-semibold text-beergam-white mb-4">
        Resultado do cálculo
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-sm text-beergam-typography-secondary">
            1. Valor total do pedido
          </span>
          <div className="text-right">
            <span className="text-sm font-medium block">{formatUsd(result.valorTotalPedidoUsd)}</span>
            <span className="text-xs text-beergam-typography-secondary">
              {formatBrl(result.valorTotalPedidoBrl)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-sm text-beergam-typography-secondary">
            2. Total do frete
          </span>
          <div className="text-right">
            <span className="text-sm font-medium block">{formatUsd(result.totalFreteUsd)}</span>
            <span className="text-xs text-beergam-typography-secondary">
              {formatBrl(result.totalFreteBrl)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-sm text-beergam-typography-secondary">
            3. Base de cálculo (Valor Aduaneiro)
          </span>
          <div className="text-right">
            <span className="text-sm font-medium block">{formatUsd(result.baseCalculoUsd)}</span>
            <span className="text-xs text-beergam-typography-secondary">
              {formatBrl(result.baseCalculoBrl)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-sm text-beergam-typography-secondary">
            4. Imposto de importação (60%)
          </span>
          <div className="text-right">
            <span className="text-sm font-medium block">{formatUsd(result.impostoImportacaoUsd)}</span>
            <span className="text-xs text-beergam-typography-secondary">
              {formatBrl(result.impostoImportacaoBrl)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-sm text-beergam-typography-secondary">5. ICMS</span>
          <div className="text-right">
            <span className="text-sm font-medium block">{formatUsd(result.icmsUsd)}</span>
            <span className="text-xs text-beergam-typography-secondary">
              {formatBrl(result.icmsBrl)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 mt-4 bg-white/5 rounded-lg px-3">
          <span className="text-sm font-semibold text-beergam-white">
            Total da importação
          </span>
          <div className="text-right">
            <span className="text-base font-bold block text-beergam-orange">
              {formatUsd(result.totalImportacaoUsd)}
            </span>
            <span className="text-sm font-semibold text-beergam-white">
              {formatBrl(result.totalImportacaoBrl)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-beergam-typography-secondary">
            Total de unidades
          </span>
          <span className="text-sm font-medium">{result.totalQuantity}</span>
        </div>

        <div className="flex justify-between items-center py-3 bg-white/5 rounded-lg px-3">
          <span className="text-sm font-semibold text-beergam-white">
            Custo unitário médio
          </span>
          <div className="text-right">
            <span className="text-base font-bold block text-beergam-orange">
              {formatUsd(result.custoUnitarioUsd)}
            </span>
            <span className="text-sm font-semibold text-beergam-white">
              {formatBrl(result.custoUnitarioBrl)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2 mt-2">
          <span className="text-xs text-beergam-typography-secondary">
            Fator de conversão
          </span>
          <span className="text-sm font-medium">
            {result.fatorConversao.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
