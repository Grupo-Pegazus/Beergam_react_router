import { IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import { TextCensored } from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import ProductImage from "../ProductImage/ProductImage";
import { ProductStatusToggle } from "../ProductStatusToggle";
import ProductChip from "./ProductChip";

interface StatusCellProps {
  hasVariations: boolean;
  variationsCount: number;
  status: string;
  isActive: boolean;
  isMutating: boolean;
  onToggleStatus: () => void;
  onOpenVariationsModal: () => void;
}

interface BaseProductCellProps {
  isVariation?: boolean;
}

function EmptyCell() {
  return "----";
}

export function StatusCellWrapper({
  children,
  label,
  justify = "end",
  isVariation = false,
}: {
  children: React.ReactNode;
  label: string;
  justify?: "start" | "end";
  isVariation?: boolean;
}) {
  return (
    <div
      className={`flex! items-center ${isVariation ? "justify-start!" : justify === "end" ? "md:justify-end" : "md:justify-start"} justify-start gap-2`}
    >
      <p className={`${isVariation ? "" : "md:hidden!"}`}>{label}</p>
      {children}
    </div>
  );
}

export function StatusCell({
  hasVariations,
  variationsCount,
  status,
  isActive,
  isMutating,
  onToggleStatus,
  onOpenVariationsModal,
}: StatusCellProps) {
  if (!hasVariations) {
    return (
      <StatusCellWrapper label="Status:" justify="start">
        <ProductStatusToggle
          status={status}
          isActive={isActive}
          isMutating={isMutating}
          onToggle={onToggleStatus}
        />
      </StatusCellWrapper>
    );
  }

  return (
    <StatusCellWrapper label="Status de variações:" justify="start">
      <ProductChip
        label={variationsCount.toString()}
        onClick={onOpenVariationsModal}
      />
    </StatusCellWrapper>
  );
}

interface ProductInfoCellProps {
  imageUrl?: string;
  title: string;
  registrationType: string;
  categoryName?: string;
  isVariation?: boolean;
}

export function ProductInfoCell({
  imageUrl,
  title,
  registrationType,
  categoryName,
  isVariation = false,
}: ProductInfoCellProps) {
  return (
    <div className="flex items-center gap-2">
      <ProductImage imageUrl={imageUrl} alt={title} size="small" />
      <div>
        <TextCensored className="flex!" censorshipKey="produtos_list">
          <h4 className="text-beergam-typography-primary font-medium">
            {title}
          </h4>
        </TextCensored>
        <div className="flex items-center gap-2 mt-2">
          <ProductChip
            label={registrationType}
            variant="rounded"
            className={`${
              registrationType === "Completo"
                ? "bg-beergam-primary!"
                : "bg-beergam-typography-secondary!"
            }  ${isVariation && "hidden!"}`}
          />
          {categoryName && (
            <ProductChip
              label={categoryName}
              variant="rounded"
              className="bg-beergam-mui-paper! text-beergam-typography-primary! border-beergam-input-border!"
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface VariationsCountCellProps extends BaseProductCellProps {
  count: number;
  onOpenModal?: () => void;
}

export function VariationsCountCell({
  count,
  onOpenModal,
  isVariation = false,
}: VariationsCountCellProps) {
  const variationsCount = count === 0 ? EmptyCell() : count.toString();
  return (
    <StatusCellWrapper label="Variações:" isVariation={isVariation}>
      <ProductChip
        label={variationsCount}
        variant="circle"
        className="bg-beergam-typography-secondary!"
        onClick={onOpenModal ?? null}
      />
    </StatusCellWrapper>
  );
}

interface PriceCellProps extends BaseProductCellProps {
  price?: number | string | null;
}

export function PriceCell({ price, isVariation = false }: PriceCellProps) {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return (
    <StatusCellWrapper label="Preço de venda:" isVariation={isVariation}>
      <TextCensored
        maxCharacters={1}
        className="flex! justify-end"
        censorshipKey="produtos_list"
      >
        <p className="text-beergam-typography-tertiary! font-medium">
          {numericPrice === null || numericPrice === undefined
            ? EmptyCell()
            : formatCurrency(numericPrice)}
        </p>
      </TextCensored>
    </StatusCellWrapper>
  );
}

interface SkuCellProps extends BaseProductCellProps {
  sku?: string | null;
}

export function SkuCell({ sku, isVariation = false }: SkuCellProps) {
  return (
    <StatusCellWrapper label="SKU:" isVariation={isVariation}>
      <TextCensored
        maxCharacters={1}
        className="flex! justify-end"
        censorshipKey="produtos_list"
      >
        <p className="text-beergam-typography-tertiary! font-medium">
          {sku ?? EmptyCell()}
        </p>
      </TextCensored>
    </StatusCellWrapper>
  );
}

interface RelatedAdsCellProps extends BaseProductCellProps {
  count: number;
}

export function RelatedAdsCell({
  count,
  isVariation = false,
}: RelatedAdsCellProps) {
  return (
    <StatusCellWrapper label="Anúncios relacionados:" isVariation={isVariation}>
      <TextCensored
        maxCharacters={1}
        className="flex! justify-end"
        censorshipKey="produtos_list"
      >
        <p className="text-beergam-typography-tertiary! font-medium">
          {count === 0 ? EmptyCell() : count}
        </p>
      </TextCensored>
    </StatusCellWrapper>
  );
}

interface SalesQuantityCellProps extends BaseProductCellProps {
  quantity?: number | null;
}

export function SalesQuantityCell({
  quantity,
  isVariation = false,
}: SalesQuantityCellProps) {
  return (
    <StatusCellWrapper label="Vendas:" isVariation={isVariation}>
      <TextCensored
        maxCharacters={1}
        className="flex! justify-end"
        censorshipKey="produtos_list"
      >
        <p className="text-beergam-typography-tertiary! font-medium">
          {quantity ?? EmptyCell()}
        </p>
      </TextCensored>
    </StatusCellWrapper>
  );
}

interface StockCellProps extends BaseProductCellProps {
  stock?: number | null;
}

export function StockCell({ stock, isVariation = false }: StockCellProps) {
  return (
    <StatusCellWrapper label="Estoque:" isVariation={isVariation}>
      <TextCensored
        maxCharacters={1}
        className="flex! justify-end"
        censorshipKey="produtos_list"
      >
        <ProductChip
          label={stock ? stock.toString() : EmptyCell()}
          className="bg-beergam-green!"
          variant="circle"
        />
      </TextCensored>
    </StatusCellWrapper>
  );
}

interface ActionsCellProps {
  productId: string;
  hasStock: boolean;
  hasVariations: boolean;
  anchorEl: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onDelete: () => void;
}

export function ActionsCell({
  productId,
  hasStock,
  hasVariations,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onDelete,
}: ActionsCellProps) {
  return (
    <div className="absolute md:static! right-1 top-1">
      <IconButton size="small" onClick={onMenuOpen}>
        <Svg.elipsis_horizontal tailWindClasses="md:h-5 md:w-5 h-8 w-8 text-beergam-primary" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onMenuClose}>
        <MenuItem
          component={Link}
          to={`/interno/produtos/gestao/${productId}`}
          onClick={onMenuClose}
        >
          <Svg.eye tailWindClasses="w-4 h-4 mr-2" />
          Ver detalhes
        </MenuItem>
        {(hasStock || hasVariations) && (
          <MenuItem
            component={Link}
            to={`/interno/produtos/estoque/${productId}`}
            onClick={onMenuClose}
          >
            <Svg.box tailWindClasses="w-4 h-4 mr-2" />
            Controle de estoque
          </MenuItem>
        )}
        <MenuItem
          component={Link}
          to={`/interno/produtos/editar/${productId}`}
          onClick={onMenuClose}
        >
          <Svg.pencil tailWindClasses="w-4 h-4 mr-2" />
          Editar produto
        </MenuItem>
        <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
          <Svg.trash tailWindClasses="w-4 h-4 mr-2" />
          Excluir produto
        </MenuItem>
      </Menu>
    </div>
  );
}
