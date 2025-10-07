import { type MarketplaceVisualInfo } from "~/features/marketplace/typings";

interface AvailableMarketplaceCardProps {
  marketplace: MarketplaceVisualInfo;
  onCardClick?: () => void;
  isSelected?: boolean;
}

enum MarketplaceAvailable {
  NOT_AVAILABLE = "Esse Marketplace ainda não está disponível.",
  LIMIT_REACHED = "Você atingiu o limite de contas disponíveis.",
}

function isMarketplaceAvailable(marketplace: MarketplaceVisualInfo) {
  let textToBeDisplayed = "";
  if (!marketplace.available) {
    textToBeDisplayed = MarketplaceAvailable.NOT_AVAILABLE;
  }
  return {
    isAvailable: marketplace.available,
    textToBeDisplayed,
  };
}

export default function AvailableMarketplaceCard({
  marketplace,
  onCardClick,
  isSelected = false,
}: AvailableMarketplaceCardProps) {
  const { isAvailable, textToBeDisplayed } =
    isMarketplaceAvailable(marketplace);

  return (
    <div
      className={`relative group`}
      onClick={() => isAvailable && onCardClick?.()}
      role="button"
      tabIndex={0}
    >
      <div
        className={`relative flex flex-col gap-2 items-center justify-center p-6 rounded-md shadow-md border-2 border-transparent ${isSelected ? "!border-beergam-orange" : ""} ${
          !isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <h3>{marketplace.label}</h3>
        <img
          className="w-20 h-20 object-fill"
          src={marketplace.image}
          alt={marketplace.label}
        />
        {textToBeDisplayed === MarketplaceAvailable.NOT_AVAILABLE && (
          <div className="absolute top-0 right-0 p-2 w-full h-full flex items-center justify-center bg-beergam-black/70 rounded-2xl">
            <p className="text-beergam-white text-center">
              {textToBeDisplayed}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
