import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { useDeleteAllProducts } from "~/features/produtos/hooks";
import { Fields } from "~/src/components/utils/_fields";
import Svg from "~/src/assets/svgs/_index";
import { useModal } from "~/src/components/utils/Modal/useModal";
import BeergamButton from "~/src/components/utils/BeergamButton";

export default function DeleteAllProductsCard() {
  const { openModal, closeModal } = useModal();
  const deleteAllMutation = useDeleteAllProducts();

  const handleClick = useCallback(() => {
    openModal(
      <DeleteAllProductsConfirmContent
        onClose={closeModal}
        onConfirm={() =>
          deleteAllMutation.mutate(undefined, { onSettled: closeModal })
        }
        isLoading={deleteAllMutation.isPending}
      />,
      {
        title: "Excluir todos os produtos",
        icon: "trash",
      }
    );
  }, [openModal, closeModal, deleteAllMutation]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex flex-col p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-beergam-input-border bg-beergam-section-background hover:border-beergam-red hover:shadow-lg transition-all duration-200 text-left w-full disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="p-2 sm:p-2.5 md:p-3 rounded-lg bg-beergam-red/10 group-hover:bg-beergam-red/20 transition-colors">
          <Svg.trash
            tailWindClasses="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-beergam-red"
          />
        </div>
      </div>
      <Typography
        variant="h6"
        fontWeight={600}
        className="text-beergam-typography-primary mb-1 text-sm sm:text-base md:text-lg"
      >
        Excluir todos os produtos
      </Typography>
      <Typography
        variant="body2"
        className="text-beergam-typography-secondary text-xs sm:text-sm leading-tight sm:leading-normal"
      >
        Remove permanentemente todos os produtos da sua conta. Esta ação não pode
        ser desfeita.
      </Typography>
    </button>
  );
}

interface DeleteAllProductsConfirmContentProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function DeleteAllProductsConfirmContent({
  onClose,
  onConfirm,
  isLoading,
}: DeleteAllProductsConfirmContentProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (confirmed) onConfirm();
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-beergam-typography-primary">
        Esta ação irá excluir <strong>permanentemente</strong> todos os produtos
        da sua conta. Não é possível desfazer.
      </p>
      <Fields.checkbox
        name="confirm-delete-all"
        checked={confirmed}
        onChange={(e) => setConfirmed(e.target.checked)}
        label="Confirme que desejo excluir todos os produtos da minha conta."
      />
      <div className="flex gap-2 justify-end pt-2">
        <BeergamButton
          title="Cancelar"
          onClick={onClose}
          mainColor="beergam-gray"
          className="bg-transparent! border! border-beergam-input-border!"
          disabled={isLoading}
        />
        <BeergamButton
          title={isLoading ? "Excluindo..." : "Excluir todos"}
          onClick={handleConfirm}
          mainColor="beergam-red"
          icon={isLoading ? undefined : "trash"}
          loading={isLoading}
          disabled={!confirmed || isLoading}
        />
      </div>
    </div>
  );
}
