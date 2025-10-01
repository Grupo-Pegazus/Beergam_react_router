import { getAvailableMarketplaces } from "~/features/marketplace/utils";
import AvailableMarketplaceCard from "./AvailableMarketplaceCard";
export default function CreateMarketplaceModal() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <h2>Selecione o Marketplace desejado</h2>
      <div className="grid grid-cols-4 gap-4">
        {getAvailableMarketplaces().map((marketplace) => (
          <AvailableMarketplaceCard
            key={marketplace.value}
            marketplace={marketplace}
            available={true}
          />
        ))}
      </div>
    </div>
  );
}
