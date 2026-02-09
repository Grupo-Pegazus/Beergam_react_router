import { Paper, TableCell } from "@mui/material";
import { useState } from "react";
import Alert from "~/src/components/utils/Alert";
import { useModal } from "~/src/components/utils/Modal/useModal";
import toast from "~/src/utils/toast";
import { useChangeProductStatus, useDeleteProduct } from "../../hooks";
import type { Product, VariationBasic } from "../../typings";
import {
  ActionsCell,
  PriceCell,
  ProductInfoCell,
  RelatedAdsCell,
  SalesQuantityCell,
  SkuCell,
  StatusCell,
  StockCell,
  VariationsCountCell,
} from "./ProductCardCells";
import VariationsDetailsModal from "./VariationsDetailsModal";
import VariationsStatusModal from "./VariationsStatusModal/VariationsStatusModal";
interface ProductCardProps {
  product: Product | VariationBasic;
  isVariation?: boolean;
}

export default function ProductCard({
  product,
  isVariation = false,
}: ProductCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const hasVariations = product.variations && product.variations.length > 0;
  const changeStatusMutation = useChangeProductStatus();
  const deleteProductMutation = useDeleteProduct();
  const { openModal, closeModal } = useModal();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenVariationsStatusModal = () => {
    openModal(
      <VariationsStatusModal product={product} onClose={closeModal} />,
      {
        title: "Gerenciar Status das Variações",
      }
    );
  };
  const handleOpenVariationsDetailsModal = () => {
    openModal(
      <VariationsDetailsModal product={product} onClose={closeModal} />,
      {
        title: "Detalhes das Variações",
      }
    );
  };
  const handleToggleStatus = () => {
    const normalizedStatus = product.status.toLowerCase().trim();
    const nextStatus = normalizedStatus === "ativo" ? "Inativo" : "Ativo";
    setIsMutating(true);
    changeStatusMutation.mutate(
      {
        productId: product.product_id,
        status: nextStatus as "Ativo" | "Inativo",
      },
      {
        onSettled: () => {
          setIsMutating(false);
        },
      }
    );
  };
  const handleDeleteClick = () => {
    handleMenuClose();
    openModal(
      <Alert
        type="warning"
        confirmText="Excluir"
        onClose={closeModal}
        mutation={deleteProductMutation}
        onConfirm={() => {
          deleteProductMutation.mutate(product.product_id, {
            onSuccess: (data) => {
              if (!data.success) {
                toast.error(data.message || "Erro ao excluir produto");
                return;
              }
              closeModal();
              toast.success(data.message || "Produto excluído com sucesso");
            },
            onError: (error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Erro ao excluir produto"
              );
            },
          });
        }}
      >
        <h3>Tem certeza que deseja excluir o produto?</h3>
        <p>
          O produto <strong>{product.title}</strong> será excluído
          permanentemente. Esta ação não pode ser desfeita.
        </p>
      </Alert>,
      {
        title: "Confirmar exclusão",
      }
    );
  };
  const mainImageUrl =
    product.images?.product?.[0] ||
    product.variations?.[0]?.images?.product?.[0];
  const variationsCount = product.variations?.length || 0;
  const relatedAdsCount = product.related_ads?.length || 0;
  const isActive = product.status.toLowerCase().trim() === "ativo";
  // Calcula o estoque total: se tem variações, soma o estoque de todas elas
  const totalStock = hasVariations
    ? (product.variations || []).reduce((sum, variation) => {
        return sum + (variation.available_quantity || 0);
      }, 0)
    : product.available_quantity;

  return (
    <>
      <TableCell>
        <StatusCell
          hasVariations={hasVariations}
          variationsCount={variationsCount}
          status={product.status}
          isActive={isActive}
          isMutating={isMutating}
          onToggleStatus={handleToggleStatus}
          onOpenVariationsModal={handleOpenVariationsStatusModal}
        />
      </TableCell>
      <TableCell align="left">
        <ProductInfoCell
          imageUrl={mainImageUrl}
          title={product.title}
          registrationType={product.registration_type}
          categoryName={product.categories?.[0]?.name}
          isVariation={isVariation}
          attributes={product.attributes}
        />
      </TableCell>
      {!isVariation && (
        <TableCell align="right">
          <VariationsCountCell
            count={variationsCount}
            onOpenModal={handleOpenVariationsDetailsModal}
          />
        </TableCell>
      )}
      <TableCell align="right">
        <PriceCell
          price={product.price_sale as number | string | null | undefined}
        />
      </TableCell>
      <TableCell align="right">
        <PriceCell
          price={
            (Number(product.price_cost) || 0) +
            (Number(product.packaging_cost) || 0) +
            (Number(product.extra_cost) || 0)
          }
        />
      </TableCell>
      <TableCell align="right">
        <SkuCell sku={product.sku} />
      </TableCell>
      {!isVariation && (
        <TableCell align="right">
          <RelatedAdsCell count={relatedAdsCount} />
        </TableCell>
      )}
      <TableCell align="right">
        <SalesQuantityCell quantity={product.sales_quantity} />
      </TableCell>
      <TableCell align="right">
        <StockCell stock={totalStock ?? null} />
      </TableCell>
      {!isVariation && (
        <TableCell align="right">
          <ActionsCell
            productId={product.product_id}
            hasStock={totalStock !== undefined}
            hasVariations={hasVariations}
            anchorEl={anchorEl}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
            onDelete={handleDeleteClick}
          />
        </TableCell>
      )}
      <Paper className="flex! flex-col gap-2 md:hidden! mb-4 relative">
        <ProductInfoCell
          imageUrl={mainImageUrl}
          title={product.title}
          registrationType={product.registration_type}
          categoryName={product.categories?.[0]?.name}
        />
        <VariationsCountCell
          count={variationsCount}
          onOpenModal={handleOpenVariationsDetailsModal}
        />
        <PriceCell
          price={product.price_sale as number | string | null | undefined}
        />
        <PriceCell
          label="Custo:"
          price={
            (Number(product.price_cost) || 0) +
            (Number(product.packaging_cost) || 0) +
            (Number(product.extra_cost) || 0)
          }
        />
        <SkuCell sku={product.sku} />
        <RelatedAdsCell count={relatedAdsCount} />
        <SalesQuantityCell quantity={product.sales_quantity} />
        <StockCell stock={totalStock ?? null} />
        <StatusCell
          hasVariations={hasVariations}
          variationsCount={variationsCount}
          status={product.status}
          isActive={isActive}
          isMutating={isMutating}
          onToggleStatus={handleToggleStatus}
          onOpenVariationsModal={handleOpenVariationsStatusModal}
        />
        <ActionsCell
          productId={product.product_id}
          hasStock={totalStock !== undefined}
          hasVariations={hasVariations}
          anchorEl={anchorEl}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
          onDelete={handleDeleteClick}
        />
      </Paper>
    </>
  );
}
