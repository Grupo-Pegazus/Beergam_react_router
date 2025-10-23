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
      className={`
        relative group transition-all duration-300 transform
        ${isAvailable ? 'hover:scale-105' : ''}
        ${isSelected ? 'scale-105' : ''}
      `}
      onClick={() => isAvailable && onCardClick?.()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isAvailable) {
            onCardClick?.();
          }
        }
      }}
    >
      <div
        className={`
          relative w-full h-48 flex flex-col items-center justify-center p-6 rounded-2xl
          border-2 transition-all duration-300 shadow-lg
          ${isSelected 
            ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 shadow-orange-200' 
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl'
          }
          ${!isAvailable 
            ? 'opacity-50 cursor-not-allowed grayscale' 
            : 'cursor-pointer hover:shadow-2xl'
          }
        `}
      >
        {/* Badge de seleção */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        )}

        {/* Ícone do marketplace */}
        <div className="mb-4 relative">
          <img
            className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-110"
            src={marketplace.image}
            alt={marketplace.label}
          />
          {isSelected && (
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Nome do marketplace */}
        <h3 className={`
          text-center font-semibold text-lg transition-colors duration-300
          ${isSelected ? 'text-orange-700' : 'text-gray-700 group-hover:text-blue-700'}
        `}>
          {marketplace.label}
        </h3>

        {/* Status de disponibilidade */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl opacity-80 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-white text-sm font-medium leading-tight">
                {textToBeDisplayed}
              </p>
            </div>
          </div>
        )}

        {/* Efeito de hover */}
        {isAvailable && !isSelected && (
          <div className="absolute inset-0 bg-linear-to-t from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300"></div>
        )}

        {/* Indicador de seleção */}
        {isSelected && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-1 bg-orange-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}
