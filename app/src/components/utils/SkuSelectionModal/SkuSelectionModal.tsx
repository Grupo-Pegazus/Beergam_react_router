import { useCallback, useMemo, useState } from "react";
import { Fields } from "~/src/components/utils/_fields";
import AlertComponent from "~/src/components/utils/Alert";

const SCROLL_THRESHOLD = 10;
const LIST_MAX_HEIGHT = "240px";

export interface SkuSelectionItem {
  sku: string;
  available_quantity?: number;
}

export interface SkuSelectionModalProps {
  /** Lista de itens (SKU com quantidade opcional) */
  items: SkuSelectionItem[];
  /** Chamado com os itens selecionados */
  onConfirm: (selected: SkuSelectionItem[]) => void;
  onClose: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  cancelText?: string;
  /** Função para gerar o texto do botão confirmar. Recebe a quantidade selecionada. */
  getConfirmText?: (selectedCount: number) => string;
  /** Rótulo para a lista (acessibilidade) */
  listAriaLabel?: string;
}

const DEFAULT_GET_CONFIRM_TEXT = (n: number) =>
  n > 0 ? `Confirmar (${n} selecionados)` : "Confirmar";

function useSelection(items: SkuSelectionItem[]) {
  const [selected, setSelected] = useState<Set<string>>(() =>
    new Set(items.map((i) => i.sku))
  );

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
 * Modal genérico para seleção de SKUs com checkboxes.
 * Usado em: ativar estoque pós-importação, reprocessar pedidos por SKU, etc.
 */
export default function SkuSelectionModal({
  items,
  onConfirm,
  onClose,
  isLoading = false,
  title = "Selecionar SKUs",
  description = "Selecione os itens desejados.",
  cancelText = "Cancelar",
  getConfirmText = DEFAULT_GET_CONFIRM_TEXT,
  listAriaLabel = "SKUs para seleção",
}: SkuSelectionModalProps) {
  const { selectedList, selectAll, deselectAll, toggle, selected } =
    useSelection(items);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedList);
  }, [onConfirm, selectedList]);

  const allSelected = selected.size === items.length;
  const noneSelected = selected.size === 0;
  const scrollable = items.length > SCROLL_THRESHOLD;

  return (
    <AlertComponent
      type="success"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText={getConfirmText(selectedList.length)}
      cancelText={cancelText}
      disabledConfirm={isLoading || selectedList.length === 0}
    >
      <h3 className="font-semibold text-lg! md:text-2xl! mb-2">{title}</h3>
      <p className="text-md! md:text-xl! text-beergam-typography-secondary! mb-3">{description}</p>

      {items.length > 0 && (
        <div className="w-full text-left">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs! md:text-sm! text-beergam-typography-secondary!">
              {selected.size} de {items.length} selecionados
            </span>
            <div className="flex gap-2 text-xs! md:text-sm!">
              <button
                type="button"
                onClick={selectAll}
                className="text-beergam-typography-primary! hover:underline disabled:opacity-50"
                disabled={allSelected}
              >
                Selecionar todos
              </button>
              <span className="text-beergam-typography-secondary!">|</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-beergam-typography-primary! hover:underline disabled:opacity-50"
                disabled={noneSelected}
              >
                Desmarcar todos
              </button>
            </div>
          </div>
          <div className="border border-beergam-input-border rounded-lg bg-beergam-section-background overflow-hidden">
            <ul
              className={`overflow-y-auto p-2 space-y-1 list-none ${
                scrollable ? "min-h-0" : ""
              }`}
              style={scrollable ? { maxHeight: LIST_MAX_HEIGHT } : undefined}
              role="listbox"
              aria-label={listAriaLabel}
            >
              {items.map((item, index) => (
                <li
                  key={item.sku}
                  className="flex items-center justify-between gap-2 min-w-0"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Fields.checkbox
                      name={`sku-selection-${index}`}
                      id={`sku-selection-${index}`}
                      checked={selected.has(item.sku)}
                      onChange={() => toggle(item.sku)}
                      label={item.sku}
                      labelPosition="right"
                      className="shrink-0"
                    />
                  </div>
                  {item.available_quantity !== undefined && (
                    <span className="text-xs! md:text-sm! text-beergam-typography-secondary! shrink-0">
                      qtd: {item.available_quantity}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AlertComponent>
  );
}
