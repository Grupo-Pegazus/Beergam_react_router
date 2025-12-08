import { TableCell, TableRow } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import authStore from "~/features/store-zustand";
import { userService } from "~/features/user/service";
import type { IUser } from "~/features/user/typings/User";
import { isMaster } from "~/features/user/utils";
import Alert from "~/src/components/utils/Alert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { type IColab } from "../../../typings/Colab";
import ColabLevelBadge from "../Badges/ColabLevelBadge";
import ColabStatusBadge from "../Badges/ColabStatusBadge";
import ColabPhoto from "../ColabPhoto";
import DeleteColab from "../DeleteColab";
export default function ColabRow({
  colab,
  actions,
  onAction,
  isCurrentColab,
}: {
  colab: IColab;
  actions: { icon: React.ReactNode; label: string }[];
  onAction: (params: { action: string; colab: IColab }) => void;
  isCurrentColab: boolean;
}) {
  const user = authStore.use.user();
  const deleteColabMutation = useMutation({
    mutationFn: async () => {
      await userService.deleteColab(colab.pin ?? "");
    },
  });
  const { openModal, closeModal } = useModal();
  const masterPin = useMemo(() => {
    if (user && isMaster(user)) {
      return (user as IUser).pin;
    }
    return colab.master_pin ?? null;
  }, [user, colab.master_pin]);

  return (
    <TableRow
      key={colab.pin}
      sx={{
        backgroundColor: isCurrentColab
          ? "var(--color-beergam-orange-light)"
          : "transparent",
      }}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="size-10">
            <ColabPhoto
              photo_id={colab.details.photo_id}
              masterPin={masterPin}
              name={colab.name}
              online={colab.is_online}
            />
          </div>
          <div>
            <p
              className="text-ellipsis overflow-hidden whitespace-nowrap"
              style={{ textWrap: "revert-layer" }}
            >
              {colab.name}
            </p>
            <p className="text-xs text-beergam-gray-light">
              {colab.is_online ? "ONLINE" : "OFFLINE"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-bold">{colab.pin}</TableCell>
      <TableCell className="font-bold">
        <ColabStatusBadge status={colab.status} className="!w-[100px]" />
      </TableCell>
      <TableCell className="font-bold">
        <ColabLevelBadge level={colab.details.level} className="!w-[140px]" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <BeergamButton
              key={action.label}
              // icon={action.icon}
              onClick={() => {
                if (action.label === "Excluir") {
                  openModal(
                    <Alert
                      type="success"
                      onClose={closeModal}
                      onConfirm={() => {
                        deleteColabMutation.mutate();
                      }}
                    >
                      <DeleteColab colab={colab} />
                    </Alert>,
                    { title: "Excluir Colaborador" }
                  );
                }
                onAction({ action: action.label, colab: colab });
              }}
              title={action.label}
              className={`text-xs!`}
              mainColor={`${action.label === "Excluir" ? "beergam-red" : "beergam-blue-primary"}`}
            />
          ))}
        </div>
      </TableCell>
    </TableRow>
  );
}
