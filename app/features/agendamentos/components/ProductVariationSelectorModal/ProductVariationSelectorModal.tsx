import { useState, useEffect, useMemo } from "react";
import { Stack, Typography, Chip } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useProducts } from "~/features/produtos/hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Loading from "~/src/assets/loading";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";

export interface SelectedProductVariation {
  product_id?: string;
  product_variation_id?: string;
  title: string;
  sku?: string | null;
}

interface ProductVariationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selections: SelectedProductVariation[]) => void;
  alreadyAddedItems?: Array<{
    product_id?: string;
    product_variation_id?: string;
  }>;
}

export default function ProductVariationSelectorModal({
  isOpen,
  onClose,
  onSelect,
  alreadyAddedItems = [],
}: ProductVariationSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedProductVariation[]>([]);

  // Reset do estado quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedItems([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useProducts({
    page: 1,
    per_page: 50,
    q: debouncedSearchTerm.trim() || undefined,
  });

  const products = useMemo(() => {
    if (!data?.success || !data.data?.products) return [];
    return data.data.products;
  }, [data]);

  // Preparar lista de itens selecionáveis (produtos SEM variações + todas as variações)
  const selectableItems = useMemo(() => {
    const items: SelectedProductVariation[] = [];

    products.forEach((product) => {
      const hasVariations = product.variations && product.variations.length > 0;

      // Adicionar apenas produtos SEM variações
      if (!hasVariations) {
        items.push({
          product_id: product.product_id,
          title: product.title || `Produto ${product.product_id}`,
          sku: product.sku,
        });
      }

      // Adicionar todas as variações de produtos que têm variações
      if (hasVariations) {
        product.variations.forEach((variation) => {
          const productTitle = product.title || `Produto ${product.product_id}`;
          const variationTitle = variation.title || `Variação ${variation.product_variation_id}`;
          items.push({
            product_variation_id: variation.product_variation_id,
            title: `${productTitle} - ${variationTitle}`,
            sku: variation.sku,
          });
        });
      }
    });

    return items;
  }, [products]);

  const handleSelectItem = (item: SelectedProductVariation) => {
    // Verificar se o item já está selecionado (toggle)
    const itemId = item.product_id || item.product_variation_id;
    const isAlreadySelected = selectedItems.some(
      (selected) => (selected.product_id || selected.product_variation_id) === itemId
    );
    
    if (isAlreadySelected) {
      // Desselecionar - remover da lista
      setSelectedItems(selectedItems.filter(
        (selected) => (selected.product_id || selected.product_variation_id) !== itemId
      ));
    } else {
      // Selecionar - adicionar à lista
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Verificar se um item já foi adicionado
  const isItemAlreadyAdded = (item: SelectedProductVariation): boolean => {
    return alreadyAddedItems.some(
      (added) =>
        (item.product_id && added.product_id === item.product_id) ||
        (item.product_variation_id && added.product_variation_id === item.product_variation_id)
    );
  };

  const handleConfirm = () => {
    if (selectedItems.length > 0) {
      onSelect(selectedItems);
      setSelectedItems([]);
      setSearchTerm("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedItems([]);
    setSearchTerm("");
    onClose();
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return selectableItems;

    const searchLower = searchTerm.toLowerCase();
    return selectableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.sku?.toLowerCase().includes(searchLower)
    );
  }, [selectableItems, searchTerm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Selecionar Produto/Variação"
      contentClassName="max-w-4xl"
      className="z-1000"
      disableClickAway={false}
    >
      <div className="flex flex-col gap-4">
        {/* Busca */}
        <Fields.wrapper>
          <Fields.label text="Buscar" />
          <Fields.input
            type="text"
            placeholder="Digite o nome do produto/varição ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Fields.wrapper>

        {/* Lista de resultados */}
        <AsyncBoundary
          isLoading={isLoading}
          error={error as unknown}
          Skeleton={Loading}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
              Não foi possível carregar os produtos.
            </div>
          )}
        >
          <div className="max-h-[400px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Typography variant="h6" color="text.secondary">
                  Nenhum produto ou variação encontrado.
                </Typography>
              </div>
            ) : (
              <Stack spacing={2}>
                {filteredItems.map((item, index) => {
                  const itemId = item.product_id || item.product_variation_id;
                  const isSelected = selectedItems.some(
                    (selected) => (selected.product_id || selected.product_variation_id) === itemId
                  );
                  const isAlreadyAdded = isItemAlreadyAdded(item);

                  return (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAlreadyAdded) {
                          handleSelectItem(item);
                        }
                      }}
                      className="relative"
                    >
                      <MainCards
                        className={`transition-all duration-200 ${
                          isAlreadyAdded
                            ? "border-gray-300 bg-gray-100/50 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "border-beergam-orange border-[3px] bg-beergam-orange/10 shadow-lg shadow-beergam-orange/20 scale-[1.02] cursor-pointer"
                            : "hover:border-beergam-orange/50 hover:shadow-md border-2 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between p-4 relative">
                          {/* Ícone de check no canto superior esquerdo */}
                          {isSelected && !isAlreadyAdded && (
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-beergam-orange rounded-full flex items-center justify-center shadow-lg z-10">
                              <Svg.check tailWindClasses="w-5 h-5 text-white" />
                            </div>
                          )}
                          {/* Indicador para itens já adicionados */}
                          {isAlreadyAdded && (
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center shadow-lg z-10">
                              <Svg.lock_closed tailWindClasses="w-5 h-5 text-white" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Typography
                                variant="body1"
                                fontWeight={isSelected ? 700 : 600}
                                className={
                                  isAlreadyAdded
                                    ? "text-gray-500"
                                    : isSelected
                                    ? "text-beergam-orange"
                                    : "text-slate-900"
                                }
                                noWrap
                              >
                                {item.title}
                              </Typography>
                              {isAlreadyAdded && (
                                <Chip
                                  label="Já adicionado"
                                  size="small"
                                  sx={{
                                    height: 24,
                                    fontSize: "0.75rem",
                                    backgroundColor: "#9ca3af",
                                    color: "white",
                                    fontWeight: 700,
                                  }}
                                />
                              )}
                              {isSelected && !isAlreadyAdded && (
                                <Chip
                                  label="✓ Selecionado"
                                  size="small"
                                  sx={{
                                    height: 24,
                                    fontSize: "0.75rem",
                                    backgroundColor: "#ff8a00",
                                    color: "white",
                                    fontWeight: 700,
                                  }}
                                />
                              )}
                            </div>
                            {item.sku && (
                              <div className="mt-1">
                                <Chip
                                  label={`SKU: ${item.sku}`}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    backgroundColor: isSelected ? "#fee2e2" : "#f1f5f9",
                                    color: isSelected ? "#991b1b" : "#475569",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                          
                          {/* Indicador visual adicional */}
                          {isSelected && !isAlreadyAdded && (
                            <div className="ml-3 shrink-0">
                              <Svg.check tailWindClasses="w-6 h-6 text-beergam-orange" />
                            </div>
                          )}
                        </div>
                      </MainCards>
                    </div>
                  );
                })}
              </Stack>
            )}
          </div>
        </AsyncBoundary>

        {/* Informação de seleção */}
        {selectedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-slate-600">
                <strong>{selectedItems.length}</strong> item{selectedItems.length > 1 ? "s" : ""} selecionado{selectedItems.length > 1 ? "s" : ""}
              </Typography>
              <button
                type="button"
                onClick={() => setSelectedItems([])}
                className="text-sm text-beergam-orange hover:underline cursor-pointer"
              >
                Limpar seleção
              </button>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-3 justify-end mt-4 pt-4 border-t">
          <BeergamButton
            title="Cancelar"
            mainColor="beergam-gray"
            animationStyle="fade"
            onClick={handleClose}
            type="button"
          />
          <BeergamButton
            title={selectedItems.length > 0 ? `Adicionar ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}` : "Selecionar"}
            mainColor="beergam-orange"
            animationStyle="slider"
            onClick={handleConfirm}
            disabled={selectedItems.length === 0}
            type="button"
          />
        </div>
      </div>
    </Modal>
  );
}

