import { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import type { Category, CreateCategory, UpdateCategory } from "../typings";
import { useCreateCategory, useUpdateCategory } from "../hooks";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  category,
}: CategoryFormModalProps) {
  const isEditing = !!category;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [formData, setFormData] = useState<CreateCategory | UpdateCategory>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Nome é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (isEditing && category) {
        await updateMutation.mutateAsync({
          categoryId: category.id,
          data: formData as UpdateCategory,
        });
      } else {
        await createMutation.mutateAsync(formData as CreateCategory);
      }
      onClose();
    } catch {
      // Erro já é tratado no hook
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Categoria" : "Criar Categoria"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Fields.wrapper>
          <Fields.label text="Nome da Categoria" />
          <Fields.input
            type="text"
            placeholder="Ex: Cervejas Especiais"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            error={errors.name}
            disabled={isLoading}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label text="Descrição (opcional)" />
          <TextField
            multiline
            rows={3}
            placeholder="Descreva a categoria..."
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={isLoading}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Fields.wrapper>

        <div className="flex gap-3 justify-end mt-4">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            variant="outlined"
            sx={{
              borderColor: "var(--color-beergam-blue-primary)",
              color: "var(--color-beergam-blue-primary)",
              "&:hover": {
                borderColor: "var(--color-beergam-orange)",
                color: "var(--color-beergam-orange)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            variant="contained"
            sx={{
              backgroundColor: "var(--color-beergam-blue-primary)",
              "&:hover": {
                backgroundColor: "var(--color-beergam-orange)",
              },
            }}
          >
            {isLoading
              ? "Salvando..."
              : isEditing
                ? "Atualizar"
                : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

