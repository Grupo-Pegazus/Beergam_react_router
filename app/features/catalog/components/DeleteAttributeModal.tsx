import Alert from "~/src/components/utils/Alert";
import type { Attribute } from "../typings";

interface DeleteAttributeModalProps {
  attribute: Attribute;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAttributeModal({
  attribute,
  onClose,
  onConfirm,
}: DeleteAttributeModalProps) {
  const hasRelatedProducts = attribute.related_products_count > 0;

  if (hasRelatedProducts) {
    return (
      <Alert
        onClose={onClose}
        type="warning"
      >
        <h3 className="font-semibold text-lg mb-2">
          Este atributo está sendo usado por {attribute.related_products_count} produto(s)/variação(ões)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Para excluir o atributo <strong>{attribute.name}</strong>, você precisa primeiro
          remover ele dos produtos/variações relacionados.
        </p>
        {attribute.related_products.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Produtos/Variações relacionados:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {attribute.related_products.map((product) => (
                <li key={product.product_id || product.variation_id}>
                  {product.title} {product.sku && `(SKU: ${product.sku})`}
                  {product.variation_id && " [Variação]"}
                </li>
              ))}
              {attribute.related_products_count > attribute.related_products.length && (
                <li className="text-gray-500 italic">
                  ... e mais {attribute.related_products_count - attribute.related_products.length} produto(s)/variação(ões)
                </li>
              )}
            </ul>
          </div>
        )}
      </Alert>
    );
  }

  return (
    <Alert
      onClose={onClose}
      onConfirm={onConfirm}
      type="warning"
      confirmText="Excluir"
    >
      <h3 className="font-semibold text-lg mb-2">
        Tem certeza que deseja excluir o atributo?
      </h3>
      <p className="text-sm text-gray-600">
        O atributo <strong>{attribute.name}</strong> será excluído permanentemente.
        Esta ação não pode ser desfeita.
      </p>
    </Alert>
  );
}

