import { Paper } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fields } from "~/src/components/utils/_fields";
import { calculatorService } from "../service";
import type { MeliProductResponse } from "../typings";
import {
  extractMlbFromLink,
  isValidMercadoLivreDomain,
} from "../utils/extractMlbFromLink";

interface MeliProductLinkSectionProps {
  productLink: string;
  onProductLinkChange: (value: string) => void;
  onProductDataLoaded: (data: {
    salePrice: string;
    classicCommission?: number;
    premiumCommission?: number;
    productInfo?: {
      title: string;
      categoryName: string;
    };
  }) => void;
}

export default function MeliProductLinkSection({
  productLink,
  onProductLinkChange,
  onProductDataLoaded,
}: MeliProductLinkSectionProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [productInfo, setProductInfo] = useState<{
    title: string;
    categoryName: string;
    imageUrl: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastProcessedMlbRef = useRef<string | null>(null);
  const onProductDataLoadedRef = useRef<
    (data: {
      salePrice: string;
      classicCommission?: number;
      premiumCommission?: number;
      productInfo?: {
        title: string;
        categoryName: string;
      };
    }) => void
  >(onProductDataLoaded);

  // Atualiza a ref sempre que a função muda
  useEffect(() => {
    onProductDataLoadedRef.current = onProductDataLoaded;
  }, [onProductDataLoaded]);

  // Função para buscar produto
  const fetchProduct = useCallback(async (link: string) => {
    // Cancela requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Valida se o link é do domínio do Mercado Livre
    if (!isValidMercadoLivreDomain(link)) {
      setError(
        "Link inválido. Por favor, insira um link do Mercado Livre (www.mercadolivre.com.br)"
      );
      setProductInfo(null);
      lastProcessedMlbRef.current = null;
      return;
    }

    const mlb = extractMlbFromLink(link);
    if (!mlb) {
      setError(
        "Link inválido. Não foi possível encontrar o ID do produto no link"
      );
      setProductInfo(null);
      lastProcessedMlbRef.current = null;
      return;
    }

    // Se já processamos este MLB com sucesso, não busca novamente
    if (lastProcessedMlbRef.current === mlb) {
      return;
    }

    setIsFetching(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      // Busca dados do produto
      const productResponse = await calculatorService.getMeliProduct(mlb);

      if (!productResponse.success || !productResponse.data) {
        setError(
          productResponse.message || "Produto não encontrado ou link inválido"
        );
        setProductInfo(null);
        lastProcessedMlbRef.current = null;
        return;
      }

      const productData: MeliProductResponse = productResponse.data;
      const salePrice = productData.prices.current.toString();

      // Busca preços de listagem para obter as comissões
      let classicCommission: number | undefined;
      let premiumCommission: number | undefined;

      if (productData.category_id && productData.prices.current > 0) {
        try {
          const listingPricesResponse =
            await calculatorService.getMeliListingPrices(
              productData.category_id,
              productData.prices.current,
              productData.currency_id,
              productData.logistics_type || "gold_pro"
            );

          if (listingPricesResponse.success && listingPricesResponse.data) {
            // Encontra gold_special (Clássico) e gold_pro (Premium)
            const classicPrice = listingPricesResponse.data.find(
              (item) => item.listing_type_id === "gold_special"
            );
            const premiumPrice = listingPricesResponse.data.find(
              (item) => item.listing_type_id === "gold_pro"
            );

            // Extrai a comissão de cada tipo
            const extractCommission = (
              item:
                | {
                    sale_fee?: number;
                    sale_fee_details?: {
                      gross_amount?: number;
                      percentage_fee?: number;
                    };
                  }
                | undefined
            ): number | undefined => {
              if (!item) return undefined;

              // Tenta sale_fee diretamente
              if (typeof item.sale_fee === "number") {
                return item.sale_fee;
              }

              // Tenta sale_fee_details.gross_amount
              if (
                item.sale_fee_details &&
                typeof item.sale_fee_details.gross_amount === "number"
              ) {
                return item.sale_fee_details.gross_amount;
              }

              // Tenta calcular a partir de sale_fee_details.percentage_fee
              if (
                item.sale_fee_details &&
                typeof item.sale_fee_details.percentage_fee === "number"
              ) {
                return (
                  (productData.prices.current *
                    item.sale_fee_details.percentage_fee) /
                  100
                );
              }

              return undefined;
            };

            classicCommission = extractCommission(classicPrice);
            premiumCommission = extractCommission(premiumPrice);
          }
        } catch (error) {
          console.warn("Erro ao buscar preços de listagem:", error);
          // Não bloqueia o fluxo se falhar ao buscar listing prices
        }
      }

      // Atualiza informações do produto
      console.log("productData.images", productData.images);
      const info = {
        title: productData.title,
        categoryName: productData.category_name || "Categoria não informada",
        imageUrl: productData.images?.thumbnail || null,
      };
      setProductInfo(info);
      setError(null);
      lastProcessedMlbRef.current = mlb;

      // Preenche os dados usando a ref para evitar dependências
      onProductDataLoadedRef.current({
        salePrice,
        classicCommission,
        premiumCommission,
        productInfo: info,
      });
    } catch (error: unknown) {
      // Ignora erros de abort
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Erro ao buscar produto:", error);
      setError("Erro ao buscar produto. Verifique o link e tente novamente.");
      setProductInfo(null);
      lastProcessedMlbRef.current = null;
    } finally {
      setIsFetching(false);
      abortControllerRef.current = null;
    }
  }, []);

  // Debounce para busca automática
  useEffect(() => {
    // Limpa timer anterior
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Se o campo está vazio, limpa as informações e reseta comissões
    if (!productLink.trim()) {
      setProductInfo(null);
      setError(null);
      lastProcessedMlbRef.current = null;
      // Limpa as comissões quando o link é removido
      onProductDataLoadedRef.current({
        salePrice: "",
        classicCommission: undefined,
        premiumCommission: undefined,
      });
      return;
    }

    // Aguarda 800ms após parar de digitar para buscar
    debounceTimerRef.current = setTimeout(() => {
      fetchProduct(productLink);
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [productLink, fetchProduct]);

  // Limpa ao desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="bg-beergam-mui-paper p-5 rounded-lg border border-beergam-section-border shadow-sm">
      <h2 className="text-lg font-semibold text-beergam-typography-primary! mb-4">
        Buscar produto do Mercado Livre
      </h2>

      <Fields.wrapper>
        <Fields.label
          text="Link do produto"
          hint="Insira aqui o link do produto (Mercado Livre)"
        />
        <Fields.input
          type="text"
          value={productLink}
          onChange={(e) => onProductLinkChange(e.target.value)}
          placeholder="Insira aqui o link do produto (Mercado Livre)"
          // className="w-full px-4 py-3 border-2 border-beergam-input-border rounded-lg focus:outline-none focus:border-beergam-primary transition-colors pr-12"
          disabled={isFetching}
        />
      </Fields.wrapper>

      {/* Informações do produto */}
      {productInfo && !error && (
        <Paper className="mt-4">
          <div className="flex gap-4">
            {/* Imagem do produto */}
            {productInfo.imageUrl && (
              <div className="shrink-0">
                <img
                  src={productInfo.imageUrl}
                  alt={productInfo.title}
                  className="w-20 h-20 object-cover rounded-lg border border-beergam-section-border"
                  onError={(e) => {
                    // Se a imagem falhar ao carregar, esconde o elemento
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Informações do produto */}
            <div className="flex-1 space-y-2">
              <div>
                <span className="text-xs font-semibold text-beergam-typography-primary">
                  Produto:
                </span>
                <p className="text-sm">{productInfo.title}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-beergam-typography-primary">
                  Categoria:
                </span>
                <p className="text-sm">{productInfo.categoryName}</p>
              </div>
            </div>
          </div>
        </Paper>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="mt-4 p-4 bg-beergam-red-light border border-beergam-red rounded-lg">
          <p className="text-sm text-beergam-red">{error}</p>
        </div>
      )}
    </div>
  );
}
