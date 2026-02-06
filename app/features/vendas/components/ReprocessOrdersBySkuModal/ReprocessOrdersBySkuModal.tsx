import AlertComponent from "~/src/components/utils/Alert";

interface ReprocessOrdersBySkuModalProps {
  skus: string[];
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

/**
 * Modal exibido após finalizar cadastro/edição de produto.
 * Oferece opção de reprocessar pedidos relacionados aos SKUs para atualizar custos.
 */
export default function ReprocessOrdersBySkuModal({
  skus,
  onConfirm,
  onClose,
  isLoading = false,
}: ReprocessOrdersBySkuModalProps) {
  return (
    <AlertComponent
      type="success"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="Sim, reprocessar"
      cancelText="Não, ir para gestão"
      disabledConfirm={isLoading}
    >
      <h3 className="font-semibold text-lg mb-2">Produto salvo com sucesso!</h3>
      <p className="text-sm text-gray-600 mb-2">
        Deseja reprocessar os pedidos relacionados a este(s) SKU(s) para
        atualizar os custos nos pedidos já existentes?
      </p>
      {skus.length > 0 && (
        <p className="text-xs text-beergam-gray mt-2">
          SKU(s): <strong>{skus.join(", ")}</strong>
        </p>
      )}
    </AlertComponent>
  );
}
