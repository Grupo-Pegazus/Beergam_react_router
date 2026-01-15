import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { useProducts } from "../../hooks";
import type { Product, ProductsFilters } from "../../typings";
import ProductCard from "./ProductCard";
import ProductListSkeleton from "./ProductListSkeleton";

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

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <>
      <div id="products-list">
        <AsyncBoundary
          isLoading={isLoading}
          error={error as unknown}
          Skeleton={ProductListSkeleton}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-beergam-red/20 bg-beergam-red/10 text-beergam-red p-4">
              Não foi possível carregar os produtos.
            </div>
          )}
        >
          <Stack spacing={2}>
            {products.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-beergam-typography-secondary!/50 bg-beergam-typography-secondary!/10 p-10 text-center">
                <span className="text-beergam-typography-secondary!">
                  <Svg.information_circle tailWindClasses="h-10 w-10" />
                </span>
                <Typography
                  variant="h6"
                  className="text-beergam-typography-secondary!"
                >
                  Nenhum produto encontrado com os filtros atuais.
                </Typography>
              </div>
            ) : (
              <>
                {/* Cabeçalho das colunas - Oculto em mobile */}
                <TableContainer>
                  <Table className="flex! flex-col md:table!">
                    <TableHead className="hidden! md:table-header-group!">
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="left">Produto</TableCell>
                        <TableCell align="right">Variações</TableCell>
                        <TableCell align="right">Preço</TableCell>
                        <TableCell align="right">SKU</TableCell>
                        <TableCell align="right">Anúncios</TableCell>
                        <TableCell align="right">Vendas</TableCell>
                        <TableCell align="right">Estoque</TableCell>
                        <TableCell align="right">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className="flex! flex-col md:table-row-group!">
                      {products.map((product) => (
                        <TableRow
                          key={product.product_id}
                          className="flex! flex-col md:table-row!"
                        >
                          <ProductCard
                            key={product.product_id}
                            product={product}
                          />
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Stack>
        </AsyncBoundary>
      </div>
      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        entityLabel="produtos"
        onChange={handlePageChange}
        scrollOnChange
        scrollTargetId="products-list"
        isLoading={isLoading}
      />
    </>
  );
}
