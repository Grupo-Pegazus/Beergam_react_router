import { type MarketplaceVisualInfo } from "~/features/marketplace/typings";

interface AvailableMarketplaceCardProps {
  marketplace: MarketplaceVisualInfo;
  available: boolean;
}

export default function AvailableMarketplaceCard({
  marketplace,
  available,
}: AvailableMarketplaceCardProps) {
  const random = Math.random();
  const isAvailable = random > 0.5;
  return (
    <div className="relative group">
      <div
        className={` relative flex flex-col gap-2 items-center justify-center p-4 rounded-md shadow-md ${!isAvailable ? "opacity-50" : ""}`}
      >
        <h3>{marketplace.label}</h3>
        <img
          className="w-20 h-20 object-fill"
          src={marketplace.image}
          alt={marketplace.label}
        />
        <p>{isAvailable ? "Disponível" : "Indisponível"}</p>
      </div>
      {!isAvailable && (
        <div className="opacity-0 absolute top-0 right-[-50%] w-40 p-2 text-beergam-white text-center rounded-2xl bg-black/70 group-hover:opacity-100">
          <p>Troque seu plano para ter acesso a este marketplace</p>
        </div>
      )}
    </div>
  );
}
