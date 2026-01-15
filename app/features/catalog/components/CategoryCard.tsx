import type { Category, RelatedProduct } from "../typings";
import { useDeleteCategory } from "../hooks";
import toast from "~/src/utils/toast";
import DeleteCategoryModal from "./DeleteCategoryModal";
import RelatedEntityCardBase from "./RelatedEntityCardBase";
import { useModal } from "~/src/components/utils/Modal/useModal";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function CategoryCard({
  category,
  onEdit,
  isExpanded = false,
  onToggleExpand,
}: CategoryCardProps) {
  const deleteCategoryMutation = useDeleteCategory();
  const { openModal, closeModal } = useModal();

  const handleConfirmDelete = () => {
    toast.promise(deleteCategoryMutation.mutateAsync(category.id), {
      loading: "Excluindo categoria...",
      success: (data) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        closeModal();
        return data.message || "Categoria excluída com sucesso";
      },
      error: (error: unknown) => {
        if (error instanceof Error) {
          return error.message;
        }
        return "Erro ao excluir categoria";
      },
    });
  };

  const handleDeleteClick = () => {
    openModal(
      <DeleteCategoryModal
        category={category}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
      />,
      {
        title: category.related_products_count > 0 
          ? "Não é possível excluir esta categoria"
          : "Confirmar exclusão",
      }
    );
  };

  const hasRelatedProducts = category.related_products_count > 0;
  const canDelete = !hasRelatedProducts;
  const remainingCount =
    category.related_products_count - category.related_products.length;

  return (
    <>
      <RelatedEntityCardBase
        title={category.name}
        circleLabel={category.name.charAt(0)}
        circleBgClass="bg-beergam-blue-primary"
        description={category.description}
        hasRelated={hasRelatedProducts}
        badgeLabel={`${category.related_products_count} produto(s)`}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        relatedSectionTitle="Produtos Relacionados:"
        relatedItems={category.related_products.map((product: RelatedProduct) => ({
          id: product.product_id,
          title: product.title,
          sku: product.sku,
        }))}
        remainingCount={remainingCount > 0 ? remainingCount : undefined}
        remainingSuffix="produto(s)"
        onEdit={() => onEdit(category)}
        onDelete={handleDeleteClick}
        canDelete={canDelete}
        deleteTooltipMessage={
          !canDelete
            ? "Não é possível excluir esta categoria pois ela está sendo usada por produtos relacionados"
            : undefined
        }
      />
    </>
  );
}

