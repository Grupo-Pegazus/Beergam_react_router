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

function EmptyCell() {
  return "----";
}

export function StatusCellWrapper({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex! items-center md:justify-end justify-start gap-2">
      <p className="md:hidden!">{label}</p>
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
      <StatusCellWrapper label="Status:">
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
    <StatusCellWrapper label="Status de variações:">
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
}

export function ProductInfoCell({
  imageUrl,
  title,
  registrationType,
  categoryName,
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
            }`}
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

interface VariationsCountCellProps {
  count: number;
  onOpenModal?: () => void;
}

export function VariationsCountCell({
  count,
  onOpenModal,
}: VariationsCountCellProps) {
  const variationsCount = count === 0 ? EmptyCell() : count.toString();
  return (
    <StatusCellWrapper label="Variações:">
      <ProductChip
        label={variationsCount}
        variant="circle"
        className="bg-beergam-typography-secondary!"
        onClick={onOpenModal ?? null}
      />
    </StatusCellWrapper>
  );
}

interface PriceCellProps {
  price?: number | string | null;
}

export function PriceCell({ price }: PriceCellProps) {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return (
    <StatusCellWrapper label="Preço de venda:">
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

interface SkuCellProps {
  sku?: string | null;
}

export function SkuCell({ sku }: SkuCellProps) {
  return (
    <StatusCellWrapper label="SKU:">
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

interface RelatedAdsCellProps {
  count: number;
}

export function RelatedAdsCell({ count }: RelatedAdsCellProps) {
  return (
    <StatusCellWrapper label="Anúncios relacionados:">
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

interface SalesQuantityCellProps {
  quantity?: number | null;
}

export function SalesQuantityCell({ quantity }: SalesQuantityCellProps) {
  return (
    <StatusCellWrapper label="Vendas:">
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

interface StockCellProps {
  stock?: number | null;
}

export function StockCell({ stock }: StockCellProps) {
  return (
    <StatusCellWrapper label="Estoque:">
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
