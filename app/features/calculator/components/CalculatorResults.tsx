import { useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Hint from "~/src/components/utils/Hint";
import type { CalculatorRequest, CalculatorResponse, ISavedCalculation, ShopeeDetails } from "../typings";
import SaveCalculationModal from "./SaveCalculationModal";
import UpdateCalculationModal from "./UpdateCalculationModal/UpdateCalculationModal";

interface CalculatorResultsProps {
  results: CalculatorResponse | null;
  formData: {
    salePrice: string;
    weeklySales: string;
  };
  calculatorType: "ml" | "shopee" | "importacao";
  inputPayload?: CalculatorRequest;
  savedCalculation?: ISavedCalculation;
  onSavedCalculationUpdate?: (updated: ISavedCalculation) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

function getValueColor(value: number): string {
  return value < 0 ? "text-red-400" : "text-green-400";
}

function getDefaultResults(formData: {
  salePrice: string;
  weeklySales: string;
}): CalculatorResponse {
  const salePrice = parseFloat(formData.salePrice) || 0;
  const weeklySales = parseInt(formData.weeklySales) || 0;
  return {
    costs: { purchase_price: 0, commission_ml: 0, shipping_cost: 0, fiscal_tributes: 0, additional_costs: 0 },
    unit_calculation: { total_expenses: 0, revenue: salePrice, gross_profit: 0, net_profit: 0 },
    weekly_calculation: { weekly_sales: weeklySales, total_expenses: 0, total_revenue: salePrice * weeklySales, total_gross_profit: 0, total_net_profit: 0 },
    margins: { gross_margin_per_unit: 0, net_margin_per_unit: 0 },
  };
}

interface ResultRowProps {
  label: string;
  value: string;
  hint?: string;
  anchorSelect?: string;
  valueClassName?: string;
  bold?: boolean;
}

function ResultRow({ label, value, hint, anchorSelect, valueClassName = "text-beergam-white", bold }: ResultRowProps) {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex items-center gap-1.5">
        <span className={`text-xs text-beergam-white ${bold ? "font-semibold" : ""}`}>{label}</span>
        {hint && anchorSelect && <Hint message={hint} anchorSelect={anchorSelect} />}
      </div>
      <span className={`text-xs font-medium ${bold ? "font-semibold" : ""} ${valueClassName}`}>{value}</span>
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <p className="text-xs font-semibold text-beergam-white/60 uppercase tracking-wide pt-3 pb-1">
      {title}
    </p>
  );
}

function ShopeeDetailsSection({ details }: { details: ShopeeDetails }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-white/10 pt-3">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center justify-between w-full text-left mb-1"
      >
        <span className="text-xs font-semibold text-beergam-white/60 uppercase tracking-wide">
          Detalhes da comissão
        </span>
        <span className="text-beergam-white/60 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="space-y-0.5 mt-1">
          <ResultRow label="Comissão bruta" value={formatCurrency(details.gross_commission)} />
          <ResultRow label="% aplicada" value={formatPercentage(details.percent_applied)} />
          <ResultRow label="Taxa fixa" value={formatCurrency(details.fixed_fee_applied)} />
          <ResultRow
            label="Subsídio Pix"
            value={`-${formatCurrency(details.pix_subsidy_amount)}`}
            hint="Valor bancado pela Shopee para pagamentos via Pix"
            anchorSelect="pix-subsidy-tooltip"
            valueClassName="text-green-400"
          />
          <ResultRow label="Comissão líquida" value={formatCurrency(details.net_commission)} />
          {details.cpf_surcharge > 0 && (
            <ResultRow
              label="Taxa CPF"
              value={`+${formatCurrency(details.cpf_surcharge)}`}
              hint="Taxa adicional de R$3 para CPF com mais de 450 pedidos em 90 dias"
              anchorSelect="cpf-surcharge-tooltip"
            />
          )}
          {details.campaign_surcharge > 0 && (
            <ResultRow
              label="Taxa campanha"
              value={`+${formatCurrency(details.campaign_surcharge)}`}
              hint="Taxa adicional de +2,5% durante Campanhas de Destaque"
              anchorSelect="campaign-surcharge-tooltip"
            />
          )}
          <div className="border-t border-white/10 pt-1 mt-1">
            <ResultRow label="Total comissão" value={formatCurrency(details.total_commission)} bold />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalculatorResults({
  results,
  formData,
  calculatorType,
  inputPayload,
  savedCalculation,
  onSavedCalculationUpdate,
}: CalculatorResultsProps) {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const displayResults = results || getDefaultResults(formData);
  const { costs, unit_calculation, weekly_calculation, margins } = displayResults;
  const isShopee = calculatorType === "shopee";
  const shopeeDetails = displayResults.shopee_details ?? null;

  return (
    <div className="sticky top-4 bg-beergam-menu-background rounded-2xl p-4 text-white border border-white/10 space-y-1">

      {/* Preço de venda */}
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <span className="text-sm font-semibold text-beergam-white">Preço de venda</span>
        <span className="text-sm font-bold text-beergam-white">{formatCurrency(unit_calculation.revenue)}</span>
      </div>

      {/* Custos */}
      <div>
        <SectionDivider title="Custos" />
        <div className="space-y-0.5">
          <ResultRow label="Preço de compra" value={formatCurrency(costs.purchase_price)} />
          <ResultRow label={isShopee ? "Taxa" : "Comissão"} value={formatCurrency(costs.commission_ml)} />
          {(costs.shipping_cost > 0 || !isShopee) && (
            <ResultRow
              label={isShopee ? "Cupom de frete (vendedor)" : "Frete"}
              value={formatCurrency(costs.shipping_cost)}
            />
          )}
          <ResultRow label="Impostos" value={formatCurrency(costs.fiscal_tributes)} />
          <ResultRow label="Custos adicionais" value={formatCurrency(costs.additional_costs)} />
        </div>
      </div>

      {/* Por unidade */}
      <div>
        <SectionDivider title="Por unidade" />
        <div className="space-y-0.5">
          <ResultRow label="Despesas totais" value={formatCurrency(unit_calculation.total_expenses)} />
          <ResultRow
            label="Receita"
            value={formatCurrency(unit_calculation.revenue)}
            hint="Receita total por unidade vendida"
            anchorSelect="revenue-tooltip"
          />
          <ResultRow
            label="Lucro bruto"
            value={formatCurrency(unit_calculation.gross_profit)}
            hint="Lucro bruto = Receita - Preço de compra"
            anchorSelect="gross-profit-tooltip"
            valueClassName={getValueColor(unit_calculation.gross_profit)}
            bold
          />
          <ResultRow
            label="Lucro líquido"
            value={formatCurrency(unit_calculation.net_profit)}
            hint="Lucro líquido = Receita - Despesas totais"
            anchorSelect="net-profit-tooltip"
            valueClassName={getValueColor(unit_calculation.net_profit)}
            bold
          />
        </div>
      </div>

      {/* Semanal */}
      <div>
        <SectionDivider title={`Semanal (${weekly_calculation.weekly_sales} vendas)`} />
        <div className="space-y-0.5">
          <ResultRow label="Despesas totais" value={formatCurrency(weekly_calculation.total_expenses)} />
          <ResultRow
            label="Receita"
            value={formatCurrency(weekly_calculation.total_revenue)}
            hint="Receita total considerando todas as vendas semanais"
            anchorSelect="total-revenue-tooltip"
          />
          <ResultRow
            label="Lucro bruto"
            value={formatCurrency(weekly_calculation.total_gross_profit)}
            hint="Lucro bruto total considerando todas as vendas"
            anchorSelect="total-gross-profit-tooltip"
            valueClassName={getValueColor(weekly_calculation.total_gross_profit)}
            bold
          />
          <ResultRow
            label="Lucro líquido"
            value={formatCurrency(weekly_calculation.total_net_profit)}
            hint="Lucro líquido total considerando todas as vendas"
            anchorSelect="total-net-profit-tooltip"
            valueClassName={getValueColor(weekly_calculation.total_net_profit)}
            bold
          />
        </div>
      </div>

      {/* Margens */}
      <div className="border-t border-white/10 pt-2 space-y-0.5">
        <ResultRow
          label="Margem bruta"
          value={formatPercentage(margins.gross_margin_per_unit)}
          hint="Margem bruta = (Lucro bruto / Receita) × 100"
          anchorSelect="gross-margin-tooltip"
          valueClassName={getValueColor(margins.gross_margin_per_unit)}
          bold
        />
        <ResultRow
          label="Margem líquida"
          value={formatPercentage(margins.net_margin_per_unit)}
          hint="Margem líquida = (Lucro líquido / Receita) × 100"
          anchorSelect="net-margin-tooltip"
          valueClassName={getValueColor(margins.net_margin_per_unit)}
          bold
        />
      </div>

      {/* Breakdown Shopee */}
      {isShopee && shopeeDetails && (
        <ShopeeDetailsSection details={shopeeDetails} />
      )}

      {/* Botão salvar / atualizar */}
      {results && inputPayload && (
        <div className="border-t border-white/10 pt-3">
          <BeergamButton
            title={savedCalculation ? "Atualizar cálculo" : "Salvar cálculo"}
            icon="calculator_solid"
            animationStyle="slider"
            className="w-full"
            onClick={() =>
              savedCalculation ? setIsUpdateModalOpen(true) : setIsSaveModalOpen(true)
            }
          />
        </div>
      )}

      {results && inputPayload && !savedCalculation && (
        <SaveCalculationModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          calculatorType={calculatorType}
          inputPayload={inputPayload}
          outputPayload={results}
        />
      )}

      {results && inputPayload && savedCalculation && (
        <UpdateCalculationModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdated={(updated) => {
            onSavedCalculationUpdate?.(updated);
            setIsUpdateModalOpen(false);
          }}
          savedCalculation={savedCalculation}
          updatedPayload={{
            input_payload: inputPayload,
            output_payload: results,
          }}
        />
      )}
    </div>
  );
}
