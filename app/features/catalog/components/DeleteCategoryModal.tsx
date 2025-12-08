import Alert from "~/src/components/utils/Alert";
import type { Category } from "../typings";

interface DeleteCategoryModalProps {
  category: Category;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCategoryModal({
  category,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  const hasRelatedProducts = category.related_products_count > 0;

  if (hasRelatedProducts) {
    return (
      <Alert
        onClose={onClose}
        type="warning"
      >
        <h3 className="font-semibold text-lg mb-2">
          Esta categoria está sendo usada por {category.related_products_count} produto(s)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Para excluir a categoria <strong>{category.name}</strong>, você precisa primeiro
          remover ela dos produtos relacionados.
        </p>
        {category.related_products.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Produtos relacionados:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {category.related_products.map((product) => (
                <li key={product.product_id}>
                  {product.title} {product.sku && `(SKU: ${product.sku})`}
                </li>
              ))}
              {category.related_products_count > category.related_products.length && (
                <li className="text-gray-500 italic">
                  ... e mais {category.related_products_count - category.related_products.length} produto(s)
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
        Tem certeza que deseja excluir a categoria?
      </h3>
      <p className="text-sm text-gray-600">
        A categoria <strong>{category.name}</strong> será excluída permanentemente.
        Esta ação não pode ser desfeita.
      </p>
    </Alert>
  );
}

