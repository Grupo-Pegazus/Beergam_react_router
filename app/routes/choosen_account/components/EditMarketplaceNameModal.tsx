import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import type { BaseMarketPlace, MarketplaceType } from "~/features/marketplace/typings";
import { MarketplaceTypeLabel } from "~/features/marketplace/typings";
import UserFields from "~/features/user/components/UserFields";
import BeergamButton from "~/src/components/utils/BeergamButton";

type ChangeNameMutation = UseMutationResult<
  unknown,
  Error,
  { marketplace: BaseMarketPlace; newName: string }
>;

interface EditMarketplaceNameModalProps {
  marketplace: BaseMarketPlace | null;
  onCancel: () => void;
  /** Chamado com a conta e o novo nome — evita depender de estado do parent que pode estar desatualizado. */
  onConfirm: (marketplace: BaseMarketPlace, newName: string) => void;
  mutation: ChangeNameMutation;
}

const MAX_NAME_LENGTH = 255;

export default function EditMarketplaceNameModal({
  marketplace,
  onCancel,
  onConfirm,
  mutation,
}: EditMarketplaceNameModalProps) {
  const [newName, setNewName] = useState(marketplace?.marketplace_name ?? "");
  const [error, setError] = useState<string | null>(null);

  const trimmedName = newName.trim();
  const isValid = trimmedName.length > 0 && trimmedName.length <= MAX_NAME_LENGTH;
  const isPending = mutation.isPending;

  function handleSubmit() {
    if (!marketplace?.marketplace_shop_id || !marketplace?.marketplace_type) return;
    setError(null);
    if (trimmedName.length === 0) {
      setError("O nome não pode ser vazio.");
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      setError(`O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`);
      return;
    }
    onConfirm(marketplace, trimmedName);
  }

  if (!marketplace) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-beergam-typography-secondary text-sm">
        Alterar o nome exibido da conta{" "}
        <strong className="text-beergam-typography-primary">
          {MarketplaceTypeLabel[marketplace.marketplace_type as MarketplaceType]}
        </strong>
        . Este nome é apenas para identificação no sistema.
      </p>
      <UserFields
        label="Nome da conta"
        name="marketplace_name"
        placeholder="Ex.: Minha Loja"
        value={newName}
        onChange={(e) => {
          const value = e.target.value ?? "";
          setNewName(value.slice(0, MAX_NAME_LENGTH));
          setError(null);
        }}
        canAlter={true}
        error={error ?? undefined}
      />
      {newName.length > 0 && (
        <span className="text-beergam-typography-secondary text-xs">
          {newName.length}/{MAX_NAME_LENGTH} caracteres
        </span>
      )}
      <div className="flex gap-3 justify-end mt-2">
        <BeergamButton
          title="Cancelar"
          mainColor="beergam-gray"
          onClick={onCancel}
          disabled={isPending}
        />
        <BeergamButton
          title="Salvar"
          icon="check"
          animationStyle="fetcher"
          onClick={handleSubmit}
          disabled={!isValid || isPending}
          fetcher={{
            fecthing: mutation.isPending,
            completed: mutation.isSuccess,
            error: mutation.isError,
            mutation,
          }}
        />
      </div>
    </div>
  );
}
