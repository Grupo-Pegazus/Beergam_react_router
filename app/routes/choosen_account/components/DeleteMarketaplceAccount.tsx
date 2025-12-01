import { type BaseMarketPlace, MarketplaceType, MarketplaceTypeLabel } from "~/features/marketplace/typings";
import Alert from "~/src/components/utils/Alert";

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
    <Alert
    isOpen={true}
    onClose={handleCancelDelete}
    onConfirm={handleConfirmDeleteClick}
    type="warning"
    title="Deletar conta do marketplace"
    >
      <h3>Tem certeza que deseja deletar a conta do marketplace:</h3>
      <p className="text-center text-lg font-bold">
        {marketplaceToDelete?.marketplace_name} ({MarketplaceTypeLabel[marketplaceToDelete?.marketplace_type as MarketplaceType]})
      </p>
      <p>
        Esta ação não pode ser desfeita.
      </p>
    </Alert>
  );
}