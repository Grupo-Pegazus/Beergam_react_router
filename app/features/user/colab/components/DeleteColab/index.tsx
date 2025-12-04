import { useMutation } from "@tanstack/react-query";
import authStore from "~/features/store-zustand";
import { userService } from "~/features/user/service";
import toast from "~/src/utils/toast";
import { type IColab } from "../../../typings/Colab";

type DeleteColabProps = {
  colab: IColab | null;
  onDeleteSuccess?: (colab: IColab) => void;
  onClose?: () => void;
};

export default function DeleteColab({
  colab,
  onDeleteSuccess,
  onClose,
}: DeleteColabProps) {
  const deleteColab = authStore.use.deleteColab();
  const deleteColabMutation = useMutation({
    mutationFn: (colabPin: string) => userService.deleteColab(colabPin),
  });

  const handleClose = () => {
    onClose?.();
  };

  const handleConfirm = () => {
    if (colab) {
      toast.promise(deleteColabMutation.mutateAsync(colab.pin ?? ""), {
        loading: "Excluindo colaborador...",
        success: (data) => {
          if (!data.success) {
            throw new Error(data.message);
          }
          deleteColab(colab.pin ?? "");
          onDeleteSuccess?.(colab);
          return data.message;
        },
        error: "Erro ao excluir colaborador",
      });
    }
  };

  return (
    <>
      <h3>Tem certeza que deseja excluir o colaborador?</h3>
      <p>
        O colaborador será removido da lista de colaboradores e não será mais
        possível acessar o sistema.
      </p>
      {/* <BeergamButton
        title="Excluir"
        onClick={handleConfirm}
        mainColor="beergam-red"
      />
      <BeergamButton
        title="Cancelar"
        onClick={handleClose}
        mainColor="beergam-blue-primary"
      /> */}
    </>
  );
}
