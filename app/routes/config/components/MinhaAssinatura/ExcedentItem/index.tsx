import type { BaseMarketPlace } from "~/features/marketplace/typings";
import ColabPhoto from "~/features/user/colab/components/ColabPhoto";
import type { IColab } from "~/features/user/typings/Colab";
import { isColab } from "~/features/user/utils";
interface ItemRender {
  name: string;
  photo: string | null;
  isSelected: boolean;
  id: string;
  item: IColab | BaseMarketPlace;
}
export default function ExcedentItem({
  item,
  selected = false,
  onSelect,
  currentQuantity,
  maxQuantityAllowed,
}: {
  item: IColab | BaseMarketPlace;
  selected: boolean;
  onSelect: (item: IColab | BaseMarketPlace) => void;
  currentQuantity: number;
  maxQuantityAllowed: number;
}) {
  const itemRender: ItemRender = {
    name: isColab(item) ? item.name : "N/A",
    photo: isColab(item) ? (item.details.photo_id ?? null) : "N/A",
    isSelected: selected,
    id: isColab(item) ? (item.pin ?? "") : "N/A",
    item: item,
  };

  const canSelect = () => {
    // Se já está selecionado, pode deselecionar
    if (selected) return true;
    // Se não está selecionado e já atingiu o limite, não pode selecionar
    if (currentQuantity >= maxQuantityAllowed) return false;
    // Caso contrário, pode selecionar
    return true;
  };

  const handleClick = () => {
    if (canSelect()) {
      onSelect(item);
    }
  };

  const isDisabled = !canSelect();

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`border rounded-md p-4 ${
        selected
          ? "border-beergam-blue-primary bg-beergam-blue-primary/10"
          : isDisabled
            ? "border-beergam-gray-light opacity-50 cursor-not-allowed!"
            : "border-beergam-gray-light hover:border-beergam-blue-primary"
      }`}
    >
      <div className="flex items-center gap-2">
        <ColabPhoto
          photo_id={itemRender.photo}
          name={itemRender.name}
          masterPin={itemRender.item.master_pin ?? null}
          size="large"
        />
        <div className="flex flex-col items-start gap-1 text-left">
          <p>Nome: {itemRender.name}</p>
          <p>PIN: {itemRender.id}</p>
        </div>
      </div>
    </button>
  );
}
