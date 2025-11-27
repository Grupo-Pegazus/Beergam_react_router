import { useEffect, useMemo, useState } from "react";
import {
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Svg from "~/src/assets/svgs/_index";
import { useProducts } from "../../hooks";
import type { ProductsFilters, Product } from "../../typings";
import ProductListSkeleton from "./ProductListSkeleton";
import ProductCard from "./ProductCard";

interface ProductListProps {
  filters?: Partial<ProductsFilters>;
}

export default function ProductList({ filters = {} }: ProductListProps) {
  const [page, setPage] = useState(filters.page ?? 1);
  const [perPage, setPerPage] = useState(filters.per_page ?? 20);

  useEffect(() => {
    setPage(filters.page ?? 1);
  }, [filters.page]);

  useEffect(() => {
    setPerPage(filters.per_page ?? 20);
  }, [filters.per_page]);

  const { data, isLoading, error } = useProducts({
    ...filters,
    page,
    per_page: perPage,
  });

  const products = useMemo<Product[]>(() => {
    if (!data?.success || !data.data?.products) return [];
    return data.data.products;
  }, [data]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? products.length;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    nextPage: number
  ) => {
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
      <Stack spacing={2}>
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <span className="text-slate-400">
              <Svg.information_circle tailWindClasses="h-10 w-10" />
            </span>
            <Typography variant="h6" color="text.secondary">
              Nenhum produto encontrado com os filtros atuais.
            </Typography>
          </div>
        ) : (
          <Stack spacing={2}>
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </Stack>
        )}

        {totalPages > 1 ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Mostrando página {page} de {totalPages} — {totalCount} produtos
              no total
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          </Stack>
        ) : null}
      </Stack>
    </AsyncBoundary>
  );
}


