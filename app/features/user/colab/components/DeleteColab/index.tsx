import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "~/src/utils/toast";
import authStore from "~/features/store-zustand";
import { userService } from "~/features/user/service";
import Alert from "~/src/components/utils/Alert";
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
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const deleteColabMutation = useMutation({
    mutationFn: (colabPin: string) => userService.deleteColab(colabPin),
  });

  // Abrir alert quando colab for definido
  useEffect(() => {
    setIsAlertOpen(colab !== null);
  }, [colab]);

  const handleClose = () => {
    setIsAlertOpen(false);
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
          setIsAlertOpen(false);
          onDeleteSuccess?.(colab);
          return data.message;
        },
        error: "Erro ao excluir colaborador",
      });
    }
  };

  return (
    <Alert
      isOpen={isAlertOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      type="info"
    >
      <h3>Tem certeza que deseja excluir o colaborador?</h3>
      <p>
        O colaborador será removido da lista de colaboradores e não será mais
        possível acessar o sistema.
      </p>
    </Alert>
  );
}
