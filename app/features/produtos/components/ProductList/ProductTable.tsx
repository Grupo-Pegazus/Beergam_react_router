import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Product, VariationBasic } from "../../typings";
import ProductCard from "./ProductCard";

interface ProductTableProps {
  products: Product[] | VariationBasic[];
}

/**
 * Componente de tabela para exibir produtos em formato de lista/table
 * Responsivo: oculta cabeçalho em mobile e usa layout flex
 */
export default function ProductTable({ products }: ProductTableProps) {
  const isVariation = (
    product: Product | VariationBasic
  ): product is VariationBasic => {
    return "product_variation_id" in product;
  };
  return (
    <TableContainer>
      <Table className="flex! flex-col md:table!">
        <TableHead className="hidden! md:table-header-group!">
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell align="left">
              {isVariation(products[0]) ? "Variação" : "Produto"}
            </TableCell>
            {!isVariation(products[0]) && (
              <TableCell align="right">Variações</TableCell>
            )}
            <TableCell align="right">Preço</TableCell>
            <TableCell align="right">SKU</TableCell>
            {!isVariation(products[0]) && (
              <TableCell align="right">Anúncios</TableCell>
            )}
            <TableCell align="right">Vendas</TableCell>
            <TableCell align="right">Estoque</TableCell>
            {!isVariation(products[0]) && (
              <TableCell align="right">Ações</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody className="flex! flex-col md:table-row-group!">
          {products.map((product) => (
            <TableRow
              key={product.product_id}
              className={`flex! flex-col md:table-row!`}
            >
              <ProductCard
                isVariation={isVariation(product)}
                key={product.product_id}
                product={product}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
