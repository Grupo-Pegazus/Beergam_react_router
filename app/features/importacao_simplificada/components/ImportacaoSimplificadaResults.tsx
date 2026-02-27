import { useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Hint from "~/src/components/utils/Hint";
import UpdateCalculationModal from "~/features/calculator/components/UpdateCalculationModal/UpdateCalculationModal";
import type { ISavedCalculation } from "~/features/calculator/typings";
import SaveImportacaoModal from "./SaveImportacaoModal/SaveImportacaoModal";
import type { ImportacaoSimplificadaFormData, ImportacaoSimplificadaResult } from "../typings";

interface ImportacaoSimplificadaResultsProps {
  result: ImportacaoSimplificadaResult | null;
  formData: ImportacaoSimplificadaFormData;
  savedCalculation?: ISavedCalculation;
  onSavedCalculationUpdate?: (updated: ISavedCalculation) => void;
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

interface DualResultRowProps {
  label: string;
  usd: number;
  brl: number;
  hint?: string;
  anchorSelect?: string;
  highlight?: boolean;
}

function DualResultRow({ label, usd, brl, hint, anchorSelect, highlight }: DualResultRowProps) {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex items-center gap-1.5">
        <span className={`text-xs text-beergam-white ${highlight ? "font-semibold" : ""}`}>
          {label}
        </span>
        {hint && anchorSelect && <Hint message={hint} anchorSelect={anchorSelect} />}
      </div>
      <div className="text-right">
        <span className={`text-xs font-medium block ${highlight ? "text-beergam-orange font-semibold" : "text-beergam-white"}`}>
          {formatUsd(usd)}
        </span>
        <span className="text-xs text-beergam-white/60">{formatBrl(brl)}</span>
      </div>
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

export default function ImportacaoSimplificadaResults({
  result,
  formData,
  savedCalculation,
  onSavedCalculationUpdate,
}: ImportacaoSimplificadaResultsProps) {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  if (!result) {
    return (
      <div className="sticky top-4 bg-beergam-menu-background rounded-2xl p-4 text-white border border-white/10">
        <p className="text-xs text-beergam-white/60">
          Preencha os campos e os resultados aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="sticky top-4 bg-beergam-menu-background rounded-2xl p-4 text-white border border-white/10 space-y-1">

      {/* Composição do custo */}
      <div>
        <SectionDivider title="Composição do custo" />
        <div className="space-y-0.5">
          <DualResultRow
            label="Valor total do pedido"
            usd={result.valorTotalPedidoUsd}
            brl={result.valorTotalPedidoBrl}
          />
          <DualResultRow
            label="Total do frete"
            usd={result.totalFreteUsd}
            brl={result.totalFreteBrl}
          />
          <DualResultRow
            label="Base de cálculo (Valor Aduaneiro)"
            usd={result.baseCalculoUsd}
            brl={result.baseCalculoBrl}
            hint="Valor aduaneiro = Valor do pedido + Frete"
            anchorSelect="base-calculo-tooltip"
          />
        </div>
      </div>

      {/* Impostos */}
      <div>
        <SectionDivider title="Impostos" />
        <div className="space-y-0.5">
          <DualResultRow
            label="Imposto de importação (60%)"
            usd={result.impostoImportacaoUsd}
            brl={result.impostoImportacaoBrl}
            hint="II fixo de 60% sobre o valor aduaneiro na importação simplificada"
            anchorSelect="ii-tooltip"
          />
          <DualResultRow
            label={`ICMS`}
            usd={result.icmsUsd}
            brl={result.icmsBrl}
            hint="ICMS calculado 'por dentro' sobre o valor total da operação"
            anchorSelect="icms-tooltip"
          />
        </div>
      </div>

      {/* Totais */}
      <div className="border-t border-white/10 pt-2 space-y-0.5">
        <DualResultRow
          label="Total da importação"
          usd={result.totalImportacaoUsd}
          brl={result.totalImportacaoBrl}
          highlight
        />
      </div>

      {/* Por unidade */}
      <div>
        <SectionDivider title={`Por unidade (${result.totalQuantity} un.)`} />
        <div className="space-y-0.5">
          <DualResultRow
            label="Custo unitário médio"
            usd={result.custoUnitarioUsd}
            brl={result.custoUnitarioBrl}
            hint="Custo total da importação dividido pela quantidade total de itens"
            anchorSelect="custo-unitario-tooltip"
            highlight
          />
          <div className="flex justify-between items-center py-1">
            <span className="text-xs text-beergam-white/60">Fator de conversão</span>
            <span className="text-xs font-medium text-beergam-white">
              {result.fatorConversao.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Botão salvar / atualizar */}
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

      {!savedCalculation && (
        <SaveImportacaoModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          inputPayload={formData}
          outputPayload={result}
        />
      )}

      {savedCalculation && (
        <UpdateCalculationModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdated={(updated) => {
            onSavedCalculationUpdate?.(updated);
            setIsUpdateModalOpen(false);
          }}
          savedCalculation={savedCalculation}
          updatedPayload={{
            input_payload: formData as unknown as Record<string, unknown>,
            output_payload: result as unknown as Record<string, unknown>,
          }}
        />
      )}
    </div>
  );
}
