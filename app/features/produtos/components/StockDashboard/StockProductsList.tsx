import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Chip, useMediaQuery, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useProducts } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import ProductImage from "../ProductImage/ProductImage";
import Svg from "~/src/assets/svgs/_index";
import ProductListSkeleton from "../ProductList/ProductListSkeleton";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { Fields } from "~/src/components/utils/_fields";

function formatNumber(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("pt-BR");
}

export default function StockProductsList() {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce da busca (500ms) para melhorar performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset para primeira página ao buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useProducts({
    sort_by: "created_at",
    sort_order: "desc",
    q: debouncedSearchTerm.trim() || undefined,
  });

  const products = useMemo(() => {
    if (!data?.success || !data.data?.products) return [];
    // Filtra apenas produtos com controle de estoque ativo
    return data.data.products.filter(
      (product) => product.available_quantity !== undefined
    );
  }, [data]);

  const cardsPerPage = useMemo(() => {
    // Mantém sempre UMA linha por página, respeitando o número de colunas da grid
    if (isXs) return 2; // grid-cols-2
    if (isSm) return 3; // sm:grid-cols-3
    if (isMd) return 4; // md:grid-cols-4
    if (isLgUp) return 6; // lg:grid-cols-5 (xl terá uma "vaga" sobrando, mas sem quebra de linha)
    return 4;
  }, [isXs, isSm, isMd, isLgUp]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * cardsPerPage;
    return products.slice(startIndex, startIndex + cardsPerPage);
  }, [page, products, cardsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / cardsPerPage)
  );
  const totalCount = products.length;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={ProductListSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar os produtos.
        </div>
      )}
    >
      <div className="mb-4">
        <Fields.input
          placeholder="Buscar por nome ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          tailWindClasses="rounded-3xl w-full sm:w-auto sm:min-w-[180px]"
        />
      </div>

      {products.length === 0 ? (
        <MainCards className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <Svg.information_circle tailWindClasses="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 text-sm text-slate-500">
            {searchTerm
              ? "Nenhum produto encontrado com os filtros aplicados."
              : "Nenhum produto com controle de estoque encontrado."}
          </p>
        </MainCards>
      ) : (
        <Stack spacing={2}>
          <MainCards className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {paginatedProducts.map((product) => {
              const mainImageUrl =
                product.images?.product?.[0] ||
                product.variations?.[0]?.images?.product?.[0];
              const variationsCount = product.variations?.length || 0;
              const hasVariations = variationsCount > 0;

              // Calcula o estoque total: se tem variações, soma o estoque de todas elas
              const totalStock = hasVariations
                ? (product.variations || []).reduce((sum, variation) => {
                    return sum + (variation.available_quantity || 0);
                  }, 0)
                : product.available_quantity || 0;

              return (
                <Link
                  key={product.product_id}
                  to={`/interno/produtos/estoque/${product.product_id}`}
                  className="block"
                >
                  <MainCards className="hover:bg-slate-50/50 transition-colors h-full hover:scale-105">
                    <div className="flex flex-col gap-2 p-2.5">
                      <div className="flex flex-col items-center gap-2">
                        <ProductImage
                          imageUrl={mainImageUrl}
                          alt={product.title}
                          size="small"
                        />
                        <div className="w-full text-center min-w-0">
                          <p className="truncate text-xs font-semibold text-slate-900 leading-tight">
                            {product.title}
                          </p>
                          {variationsCount > 0 && (
                            <Chip
                              label={`${variationsCount} var${variationsCount !== 1 ? "s" : ""}`}
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: "0.6rem",
                                backgroundColor: "#dbeafe",
                                color: "#1e40af",
                                fontWeight: 600,
                                mt: 0.5,
                                "& .MuiChip-label": {
                                  px: 0.5,
                                },
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                        <span className="text-xs text-slate-500">Estoque:</span>
                        <span className="text-xs font-semibold text-slate-900">
                          {formatNumber(totalStock)}
                        </span>
                      </div>
                    </div>
                  </MainCards>
                </Link>
              );
            })}
          </MainCards>

          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            entityLabel="produtos com controle de estoque"
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </AsyncBoundary>
  );
}

