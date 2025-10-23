import { type BaseMarketPlace, MarketplaceType, MarketplaceTypeLabel } from "~/features/marketplace/typings";

interface DeleteMarketplaceAccountProps {
  marketplaceToDelete: BaseMarketPlace | null;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => void;
}


export default function DeleteMarketaplceAccount({
  marketplaceToDelete,
  handleCancelDelete,
  handleConfirmDelete,
}: DeleteMarketplaceAccountProps) {
  // Função para validar marketplace seguindo Single Responsibility Principle
  function isValidMarketplace(marketplace: BaseMarketPlace | null): boolean {
    return !!(
      marketplace && 
      marketplace.marketplace_shop_id && 
      marketplace.marketplace_type
    );
  }

  function handleConfirmDeleteClick() {
    if (isValidMarketplace(marketplaceToDelete)) {
      handleConfirmDelete();
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center p-8 max-w-md">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">Deletar Conta</h2>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 mb-2">
          Tem certeza que deseja deletar a conta do marketplace:
        </p>
        <p className="text-lg font-semibold text-gray-800">
          {marketplaceToDelete?.marketplace_name} ({MarketplaceTypeLabel[marketplaceToDelete?.marketplace_type as MarketplaceType]})
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Esta ação não pode ser desfeita.
        </p>
      </div>
      
      <div className="flex gap-3 w-full">
        <button 
          onClick={handleCancelDelete}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmDeleteClick}
          disabled={!isValidMarketplace(marketplaceToDelete)}
          className="flex-1 px-6 py-3 bg-beergam-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sim, Deletar
        </button>
      </div>
    </div>
  );
}