import { Paper, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { Fields } from "~/src/components/utils/_fields";
import { useProducts } from "../../hooks";
import ProductImage from "../ProductImage/ProductImage";
import ProductListSkeleton from "../ProductList/ProductListSkeleton";

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

  const totalPages = Math.max(1, Math.ceil(products.length / cardsPerPage));
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
      <Paper>
        <div className="mb-4">
          <Fields.input
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            tailWindClasses="rounded-3xl w-full sm:w-auto sm:min-w-[180px]"
          />
        </div>

        {products.length === 0 ? (
          <MainCards className="rounded-3xl border border-dashed border-beergam-typography-secondary!/50 bg-beergam-typography-secondary!/10 p-10 text-center">
            <Svg.information_circle tailWindClasses="mx-auto h-8 w-8 text-beergam-typography-secondary!" />
            <p className="mt-2 text-sm text-beergam-typography-secondary!">
              {searchTerm
                ? "Nenhum produto encontrado com os filtros aplicados."
                : "Nenhum produto com controle de estoque encontrado."}
            </p>
          </MainCards>
        ) : (
          <Stack spacing={2}>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
                    <Paper className="bg-beergam-section-background! hover:bg-beergam-primary/20!">
                      <div className="flex flex-col gap-2 p-2.5">
                        <div className="flex flex-col items-center gap-2">
                          <ProductImage
                            imageUrl={mainImageUrl}
                            alt={product.title}
                            size="small"
                          />
                          <div className="w-full text-center min-w-0">
                            <p className="truncate text-xs font-semibold text-beergam-typography-primary!">
                              {product.title}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start justify-between gap-2 pt-1.5 border-t border-slate-100">
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-xs text-beergam-typography-secondary!">
                              Estoque:
                            </span>
                            <span className="text-xs font-semibold text-beergam-typography-tertiary!">
                              {formatNumber(totalStock)}
                            </span>
                          </div>
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-xs text-beergam-typography-secondary!">
                              Variações:
                            </span>
                            <span className="text-xs font-semibold text-beergam-typography-tertiary!">
                              {variationsCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </Link>
                );
              })}
            </div>

            <PaginationBar
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              entityLabel="produtos com controle de estoque"
              onChange={handlePageChange}
            />
          </Stack>
        )}
      </Paper>
    </AsyncBoundary>
  );
}
