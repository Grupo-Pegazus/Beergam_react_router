import type React from "react";
import type { ImportProgress } from "../typings";
import {
  type BaseMarketPlace,
  MarketplaceStatusParse,
  MarketplaceType,
} from "../typings";
import Svg from "~/src/assets/svgs/_index";
import { getMarketplaceImageUrl } from "~/src/constants/cdn-images";
import ImportProgressOverlay from "./ImportProgress/ImportProgressOverlay";

function MarketplaceTypeBadge(marketplace_type: MarketplaceType) {
  return getMarketplaceImageUrl(marketplace_type);
}
interface MarketplaceCardProps {
  marketplace?: BaseMarketPlace;
  importProgress?: ImportProgress | null;
  onCardClick?: () => void;
  onProgressClick?: () => void;
  onDelete?: (marketplace: BaseMarketPlace) => void;
  onEdit?: (marketplace: BaseMarketPlace) => void;
  selected?: boolean;
  className?: string;
}
export default function MarketplaceCard({
  marketplace,
  importProgress,
  onCardClick,
  onProgressClick,
  onDelete,
  onEdit,
  selected = false,
  className,
}: MarketplaceCardProps) {
  const isProcessing =
    marketplace?.status_parse === MarketplaceStatusParse.PROCESSING;
  const isDisabled = isProcessing && !onProgressClick;
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (marketplace && onDelete && !isDisabled) {
      onDelete(marketplace);
    }
  };
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (marketplace && onEdit && !isDisabled) {
      onEdit(marketplace);
    }
  };

  const handleCardClick = () => {
    if (isProcessing && onProgressClick) {
      onProgressClick();
      return;
    }
    if (!isProcessing) {
      onCardClick?.();
    }
  };
  return (
    <div
      className={`group cursor-pointer ${className ?? ""} ${selected ? "border-beergam-orange! bg-beergam-orange/10!" : ""} flex justify-center items-center relative mb-4 p-8 shadow-lg/55 rounded-2xl flex-col gap-2 border-2 bg-beergam-section-background! ${
        marketplace
          ? `bg-beergam-white border-transparent ${
              isDisabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-75"
            }`
          : "bg-beergam-blue-primary/75 border-dashed border-beergam-typography-primary hover:opacity-75"
      }`}
      onClick={handleCardClick}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (isDisabled) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {marketplace ? (
        <>
          {/* Container para badges e botão de deletar no topo */}
          <div className="absolute top-2 right-2 flex items-start gap-2 z-20">
            {/* Badge do Marketplace */}
            <div className="max-w-10 max-h-10">
              <img
                className="w-full h-full"
                src={MarketplaceTypeBadge(marketplace.marketplace_type)}
                alt=""
              />
            </div>
          </div>
          {!isDisabled && (
            <div className="absolute top-2 left-2 flex items-start gap-2 z-20">
              {onEdit && (
                <button
                  className="bg-beergam-blue-primary opacity-90 hover:opacity-100 active:opacity-100 md:opacity-0 md:group-hover:opacity-100 w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-200 shadow-lg"
                  onClick={handleEditClick}
                  aria-label="Editar nome da conta"
                >
                  <Svg.pencil tailWindClasses="stroke-beergam-white w-5 h-5" />
                </button>
              )}
              <button
                className="bg-beergam-red-primary opacity-90 hover:opacity-100 active:opacity-100 md:opacity-0 md:group-hover:opacity-100 w-10 h-10 rounded-full flex items-center justify-center transition-opacity duration-200 shadow-lg"
                onClick={handleDeleteClick}
                aria-label="Deletar conta"
              >
                <Svg.trash tailWindClasses="stroke-beergam-white w-5 h-5" />
              </button>
            </div>
          )}

          <img
            src={marketplace.marketplace_image}
            alt={marketplace.marketplace_name}
            className="max-w-44 max-h-44 object-cover rounded-2xl shadow-2xl"
          />
          <h3 className="text-center font-semibold truncate max-w-80 text-beergam-typography-primary">
            {marketplace.marketplace_name}
          </h3>

          {/* Overlay de processamento com progresso */}
          {isProcessing &&
            (importProgress ? (
              <ImportProgressOverlay progress={importProgress} />
            ) : (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2" />
                  <p className="text-sm font-medium">Processando...</p>
                </div>
              </div>
            ))}
        </>
      ) : (
        <>
          <h2 className="text-beergam-typography-primary">Adicionar Lojas</h2>
          <Svg.plus_circle tailWindClasses="stroke-beergam-typography-primary w-14 lg:w-20" />
        </>
      )}
    </div>
  );
}
