import type { MarketplaceVisualInfo } from "~/features/marketplace/typings";
import Svg from "~/src/assets/svgs/_index";

interface AvailableMarketplaceCardProps {
  marketplace: MarketplaceVisualInfo;
  onCardClick?: () => void;
  isSelected?: boolean;
}

const NOT_AVAILABLE_MESSAGE = "Esse Marketplace ainda não está disponível.";

function getAvailability(marketplace: MarketplaceVisualInfo) {
  return {
    isAvailable: marketplace.available,
    message: marketplace.available ? "" : NOT_AVAILABLE_MESSAGE,
  };
}

export default function AvailableMarketplaceCard({
  marketplace,
  onCardClick,
  isSelected = false,
}: AvailableMarketplaceCardProps) {
  const { isAvailable, message } = getAvailability(marketplace);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (isAvailable) onCardClick?.();
  };

  return (
    <div
      className={`
        relative group transition-all duration-200
        ${isAvailable ? "hover:scale-[1.02]" : ""}
        ${isSelected ? "scale-[1.02]" : ""}
      `}
      onClick={() => isAvailable && onCardClick?.()}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-disabled={!isAvailable}
    >
      <div
        className={`
          relative w-full min-h-44 flex flex-col items-center justify-center p-5 rounded-2xl
          border-2 transition-all duration-200 shadow-sm
          bg-beergam-section-background! border-beergam-section-border
          ${isSelected
            ? "border-beergam-orange! bg-beergam-orange/10! shadow-md"
            : "hover:border-beergam-blue-primary/50 hover:shadow-md"
          }
          ${!isAvailable
            ? "opacity-60 cursor-not-allowed grayscale"
            : "cursor-pointer"
          }
        `}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 w-7 h-7 bg-beergam-orange rounded-full flex items-center justify-center shadow-md">
            <Svg.check tailWindClasses="stroke-beergam-white w-4 h-4" />
          </div>
        )}

        <div className="mb-3 relative shrink-0">
          <img
            className="w-14 h-14 object-contain"
            src={marketplace.image}
            alt={marketplace.label}
          />
        </div>

        <h3
          className={`
            text-center font-semibold text-base text-beergam-typography-primary
            ${isSelected ? "text-beergam-orange-dark!" : ""}
          `}
        >
          {marketplace.label}
        </h3>

        {isSelected && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-beergam-orange rounded-full" />
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-beergam-typography-tertiary/80 backdrop-blur-[2px] rounded-2xl flex items-center justify-center p-4">
            <p className="text-beergam-white text-sm font-medium text-center">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
