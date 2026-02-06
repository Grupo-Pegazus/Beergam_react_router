import { useCallback, useMemo, useState } from "react";
import { Fields } from "~/src/components/utils/_fields";
import AlertComponent from "~/src/components/utils/Alert";

const SCROLL_THRESHOLD = 10;
const LIST_MAX_HEIGHT = "240px";

interface ReprocessOrdersBySkuModalProps {
  skus: string[];
  /** Chamado com a lista de SKUs selecionados pelo usuário (não mais todos os skus) */
  onConfirm: (selectedSkus: string[]) => void;
  onClose: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  cancelText?: string;
}

const DEFAULT_TITLE = "Produto salvo com sucesso!";
const DEFAULT_DESCRIPTION =
  "Deseja reprocessar os pedidos relacionados a este(s) SKU(s) para atualizar os custos nos pedidos já existentes?";

function useSelection(skus: string[]) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(skus));

  const selectAll = useCallback(() => {
    setSelected(new Set(skus));
  }, [skus]);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const toggle = useCallback((sku: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  }, []);

  const selectedList = useMemo(
    () => skus.filter((s) => selected.has(s)),
    [skus, selected]
  );

  return { selected, selectedList, selectAll, deselectAll, toggle };
}

/**
 * Modal exibido após cadastro/edição de produto ou importação por planilha.
 * Permite escolher quais SKUs reprocessar; layout adaptativo para muitos SKUs.
 */
export default function ReprocessOrdersBySkuModal({
  skus,
  onConfirm,
  onClose,
  isLoading = false,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  cancelText = "Não, ir para gestão",
}: ReprocessOrdersBySkuModalProps) {
  const { selectedList, selectAll, deselectAll, toggle, selected } =
    useSelection(skus);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedList);
  }, [onConfirm, selectedList]);

  const allSelected = selected.size === skus.length;
  const noneSelected = selected.size === 0;
  const scrollable = skus.length > SCROLL_THRESHOLD;

  return (
    <AlertComponent
      type="success"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText={
        selectedList.length > 0
          ? `Reprocessar ${selectedList.length} SKU(s)`
          : "Sim, reprocessar"
      }
      cancelText={cancelText}
      disabledConfirm={isLoading || selectedList.length === 0}
    >
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {skus.length > 0 && (
        <div className="w-full text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-beergam-gray">
              {selected.size} de {skus.length} selecionados
            </span>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={selectAll}
                className="text-beergam-blue-primary hover:underline disabled:opacity-50"
                disabled={allSelected}
              >
                Selecionar todos
              </button>
              <span className="text-beergam-gray">|</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-beergam-blue-primary hover:underline disabled:opacity-50"
                disabled={noneSelected}
              >
                Desmarcar todos
              </button>
            </div>
          </div>
          <div className="border border-beergam-input-border rounded-lg bg-beergam-section-background overflow-hidden">
            <ul
              className={`overflow-y-auto p-2 space-y-1 list-none ${scrollable ? "min-h-0" : ""}`}
              style={scrollable ? { maxHeight: LIST_MAX_HEIGHT } : undefined}
              role="listbox"
              aria-label="SKUs para reprocessar"
            >
              {skus.map((sku, index) => (
                <li key={sku} className="flex items-center gap-2 min-w-0">
                  <Fields.checkbox
                    name={`reprocess-sku-${index}`}
                    id={`reprocess-sku-${index}`}
                    checked={selected.has(sku)}
                    onChange={() => toggle(sku)}
                    label={sku}
                    labelPosition="right"
                    className="shrink-0"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AlertComponent>
  );
}
