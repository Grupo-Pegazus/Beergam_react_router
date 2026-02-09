import { useCallback, useMemo, useState } from "react";
import { Fields } from "~/src/components/utils/_fields";
import AlertComponent from "~/src/components/utils/Alert";

const SCROLL_THRESHOLD = 10;
const LIST_MAX_HEIGHT = "240px";

export interface SkuWithQuantity {
  sku: string;
  available_quantity: number;
}

interface ActivateStockModalProps {
  createdSkus: SkuWithQuantity[];
  onConfirm: (selected: SkuWithQuantity[]) => void;
  onClose: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  cancelText?: string;
}

const DEFAULT_TITLE = "Ativar controle de estoque";
const DEFAULT_DESCRIPTION =
  "Deseja ativar o controle de estoque para os produtos criados na importação? Você pode selecionar quais SKUs incluir.";

function useSelection(items: SkuWithQuantity[]) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(items.map((i) => i.sku)));

  const selectAll = useCallback(() => {
    setSelected(new Set(items.map((i) => i.sku)));
  }, [items]);

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
    () => items.filter((item) => selected.has(item.sku)),
    [items, selected]
  );

  return { selected, selectedList, selectAll, deselectAll, toggle };
}

/**
 * Modal exibido após importação por planilha quando há produtos criados.
 * Permite ao usuário escolher para quais SKUs ativar o controle de estoque.
 */
export default function ActivateStockModal({
  createdSkus,
  onConfirm,
  onClose,
  isLoading = false,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  cancelText = "Não, fechar",
}: ActivateStockModalProps) {
  const { selectedList, selectAll, deselectAll, toggle, selected } = useSelection(createdSkus);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedList);
  }, [onConfirm, selectedList]);

  const allSelected = selected.size === createdSkus.length;
  const noneSelected = selected.size === 0;
  const scrollable = createdSkus.length > SCROLL_THRESHOLD;

  return (
    <AlertComponent
      type="success"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText={
        selectedList.length > 0
          ? `Ativar para ${selectedList.length} SKU(s)`
          : "Ativar estoque"
      }
      cancelText={cancelText}
      disabledConfirm={isLoading || selectedList.length === 0}
    >
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {createdSkus.length > 0 && (
        <div className="w-full text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-beergam-gray">
              {selected.size} de {createdSkus.length} selecionados
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
              aria-label="SKUs para ativar controle de estoque"
            >
              {createdSkus.map((item, index) => (
                <li key={item.sku} className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Fields.checkbox
                      name={`activate-stock-${index}`}
                      id={`activate-stock-${index}`}
                      checked={selected.has(item.sku)}
                      onChange={() => toggle(item.sku)}
                      label={item.sku}
                      labelPosition="right"
                      className="shrink-0"
                    />
                  </div>
                  <span className="text-xs text-beergam-typography-secondary shrink-0">
                    qtd: {item.available_quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AlertComponent>
  );
}
