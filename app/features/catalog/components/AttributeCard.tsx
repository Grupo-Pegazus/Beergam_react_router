import { Chip } from "@mui/material";
import type { Attribute, RelatedProduct } from "../typings";
import { useDeleteAttribute } from "../hooks";
import toast from "~/src/utils/toast";
import DeleteAttributeModal from "./DeleteAttributeModal";
import RelatedEntityCardBase from "./RelatedEntityCardBase";
import { useModal } from "~/src/components/utils/Modal/useModal";

interface AttributeCardProps {
  attribute: Attribute;
  onEdit: (attribute: Attribute) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export default function AttributeCard({
  attribute,
  onEdit,
  isExpanded = false,
  onToggleExpand,
}: AttributeCardProps) {
  const deleteAttributeMutation = useDeleteAttribute();
  const { openModal, closeModal } = useModal();

  const handleConfirmDelete = () => {
    toast.promise(deleteAttributeMutation.mutateAsync(attribute.id), {
      loading: "Excluindo atributo...",
      success: (data) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        closeModal();
        return data.message || "Atributo excluído com sucesso";
      },
      error: (error: unknown) => {
        if (error instanceof Error) {
          return error.message;
        }
        return "Erro ao excluir atributo";
      },
    });
  };

  const handleDeleteClick = () => {
    openModal(
      <DeleteAttributeModal
        attribute={attribute}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
      />,
      {
        title: attribute.related_products_count > 0 
          ? "Não é possível excluir este atributo"
          : "Confirmar exclusão",
      }
    );
  };

  const hasRelatedProducts = attribute.related_products_count > 0;
  const canDelete = !hasRelatedProducts;
  const remainingCount =
    attribute.related_products_count - attribute.related_products.length;

  return (
    <>
      <RelatedEntityCardBase
        title={attribute.name}
        circleLabel={attribute.name.charAt(0)}
        circleBgClass="bg-beergam-orange"
        description={null}
        hasRelated={hasRelatedProducts}
        badgeLabel={`${attribute.related_products_count} produto(s)`}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        relatedSectionTitle="Produtos/Variações Relacionados:"
        relatedItems={attribute.related_products.map((product: RelatedProduct) => ({
          id: product.product_id || product.variation_id || `${product.title}`,
          title: product.title,
          sku: product.sku,
          extraTag: product.variation_id ? "[Variação]" : undefined,
        }))}
        remainingCount={remainingCount > 0 ? remainingCount : undefined}
        remainingSuffix="produto(s)/variação(ões)"
        extraHeaderContent={
          attribute.allowed_values && attribute.allowed_values.length > 0 ? (
            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {attribute.allowed_values.slice(0, 3).map((value, index) => (
                <Chip
                  key={index}
                  label={value}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.85rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                  }}
                />
              ))}
              {attribute.allowed_values.length > 3 && (
                <Chip
                  label={`+${attribute.allowed_values.length - 3}`}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.85rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                  }}
                />
              )}
            </div>
          ) : null
        }
        onEdit={() => onEdit(attribute)}
        onDelete={handleDeleteClick}
        canDelete={canDelete}
        deleteTooltipMessage={
          !canDelete
            ? "Não é possível excluir este atributo pois ele está sendo usado por produtos/variações relacionados"
            : undefined
        }
      />
    </>
  );
}

