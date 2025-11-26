import React from "react";
import type { CalculatorResponse } from "../typings";
import Hint from "~/src/components/utils/Hint";

interface CalculatorResultsProps {
  results: CalculatorResponse | null;
  formData: {
    salePrice: string;
    weeklySales: string;
  };
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
  if (value < 0) {
    return "text-red-600";
  }
  return "text-green-600";
}

function getDefaultResults(formData: {
  salePrice: string;
  weeklySales: string;
}): CalculatorResponse {
  const salePrice = parseFloat(formData.salePrice) || 0;
  const weeklySales = parseInt(formData.weeklySales) || 0;

  return {
    costs: {
      purchase_price: 0,
      commission_ml: 0,
      shipping_cost: 0,
      fiscal_tributes: 0,
      additional_costs: 0,
    },
    unit_calculation: {
      total_expenses: 0,
      revenue: salePrice,
      gross_profit: 0,
      net_profit: 0,
    },
    weekly_calculation: {
      weekly_sales: weeklySales,
      total_expenses: 0,
      total_revenue: salePrice * weeklySales,
      total_gross_profit: 0,
      total_net_profit: 0,
    },
    margins: {
      gross_margin_per_unit: 0,
      net_margin_per_unit: 0,
    },
  };
}

export default function CalculatorResults({
  results,
  formData,
}: CalculatorResultsProps) {
  const displayResults = results || getDefaultResults(formData);
  const { costs, unit_calculation, weekly_calculation, margins } =
    displayResults;

  return (
    <div className="sticky top-4 space-y-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm font-medium text-beergam-gray">
            Preço de venda
          </span>
          <span className="text-base font-semibold text-beergam-blue-primary">
            {formatCurrency(unit_calculation.revenue)}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-beergam-blue-primary">
            Custos
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-beergam-gray">Preço de compra</span>
              <span className="text-sm font-medium">
                {formatCurrency(costs.purchase_price)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-beergam-gray">Comissão</span>
              <span className="text-sm font-medium">
                {formatCurrency(costs.commission_ml)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-beergam-gray">Frete</span>
              <span className="text-sm font-medium">
                {formatCurrency(costs.shipping_cost)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-beergam-gray">Impostos</span>
              <span className="text-sm font-medium">
                {formatCurrency(costs.fiscal_tributes)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-beergam-gray">
                Custos adicionais
              </span>
              <span className="text-sm font-medium">
                {formatCurrency(costs.additional_costs)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <h3 className="text-base font-semibold text-beergam-blue-primary">
            Resultado do cálculo
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-beergam-gray mb-3">
                Por unidade
              </h4>
              <div className="space-y-2.5 pl-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-beergam-gray">
                    Despesas totais
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(unit_calculation.total_expenses)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-beergam-gray">Receita</span>
                    <Hint
                      message="Receita total por unidade vendida"
                      anchorSelect="revenue-tooltip"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(unit_calculation.revenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-beergam-gray">
                      Lucro bruto
                    </span>
                    <Hint
                      message="Lucro bruto = Receita - Preço de compra"
                      anchorSelect="gross-profit-tooltip"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getValueColor(unit_calculation.gross_profit)}`}>
                    {formatCurrency(unit_calculation.gross_profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-beergam-gray">
                      Lucro líquido
                    </span>
                    <Hint
                      message="Lucro líquido = Receita - Despesas totais"
                      anchorSelect="net-profit-tooltip"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getValueColor(unit_calculation.net_profit)}`}>
                    {formatCurrency(unit_calculation.net_profit)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-beergam-gray mb-3">
                Incluindo todas as vendas
              </h4>
              <div className="space-y-2.5 pl-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-beergam-gray">
                    Média semanal de vendas
                  </span>
                  <span className="text-sm font-medium">
                    {weekly_calculation.weekly_sales}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-beergam-gray">
                    Despesas totais
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(weekly_calculation.total_expenses)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-beergam-gray">Receita</span>
                    <Hint
                      message="Receita total considerando todas as vendas semanais"
                      anchorSelect="total-revenue-tooltip"
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {formatCurrency(weekly_calculation.total_revenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-beergam-gray">
                      Lucro bruto
                    </span>
                    <Hint
                      message="Lucro bruto total considerando todas as vendas"
                      anchorSelect="total-gross-profit-tooltip"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getValueColor(weekly_calculation.total_gross_profit)}`}>
                    {formatCurrency(weekly_calculation.total_gross_profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-beergam-gray">
                      Lucro líquido
                    </span>
                    <Hint
                      message="Lucro líquido total considerando todas as vendas"
                      anchorSelect="total-net-profit-tooltip"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getValueColor(weekly_calculation.total_net_profit)}`}>
                    {formatCurrency(weekly_calculation.total_net_profit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-2.5">
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-beergam-gray">
                    Margem bruta
                  </span>
                  <Hint
                    message="Margem bruta = (Lucro bruto / Receita) × 100"
                    anchorSelect="gross-margin-tooltip"
                  />
                </div>
                <span className={`text-sm font-semibold ${getValueColor(margins.gross_margin_per_unit)}`}>
                  {formatPercentage(margins.gross_margin_per_unit)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-beergam-gray">
                    Margem líquida
                  </span>
                  <Hint
                    message="Margem líquida = (Lucro líquido / Receita) × 100"
                    anchorSelect="net-margin-tooltip"
                  />
                </div>
                <span className={`text-sm font-semibold ${getValueColor(margins.net_margin_per_unit)}`}>
                  {formatPercentage(margins.net_margin_per_unit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
