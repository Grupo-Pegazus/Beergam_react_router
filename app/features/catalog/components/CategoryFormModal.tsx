import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import type { Category, CreateCategory, UpdateCategory } from "../typings";
import { CreateCategorySchema, UpdateCategorySchema } from "../typings";
import { useCreateCategory, useUpdateCategory } from "../hooks";
import BeergamButton from "~/src/components/utils/BeergamButton";

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

  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

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

  const validate = (): { isValid: boolean; errors: { name?: string; description?: string } } => {
    // Normalizar dados: converter strings vazias em undefined para campos opcionais
    const normalizedData = {
      name: formData.name?.trim() || undefined,
      description: formData.description?.trim() || undefined,
    };

    const schema = isEditing ? UpdateCategorySchema : CreateCategorySchema;
    const result = schema.safeParse(normalizedData);

    if (result.success) {
      setErrors({});
      return { isValid: true, errors: {} };
    }

    const newErrors: { name?: string; description?: string } = {};
    if (result.error && result.error.issues) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && issue.message) {
          // Se já existe um erro para este campo, manter o primeiro (mais específico)
          if (!newErrors[path as keyof typeof newErrors]) {
            newErrors[path as keyof typeof newErrors] = issue.message;
          }
        }
      });
    }

    setErrors(newErrors);
    return { isValid: false, errors: newErrors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate();
    if (!validation.isValid) {
      // Scroll para o primeiro erro se houver
      const firstErrorField = Object.keys(validation.errors)[0];
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                            document.querySelector(`input[placeholder*="${firstErrorField === 'name' ? 'Categoria' : 'Descrição'}"]`);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Normalizar dados antes de enviar
    const dataToSend = {
      name: formData.name?.trim(),
      description: formData.description?.trim() || undefined,
    };

    try {
      if (isEditing && category) {
        await updateMutation.mutateAsync({
          categoryId: category.id,
          data: dataToSend as UpdateCategory,
        });
      } else {
        await createMutation.mutateAsync(dataToSend as CreateCategory);
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
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              // Limpar erro quando o usuário começar a digitar
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            disabled={isLoading}
            fullWidth
            variant="outlined"
            error={!!errors.description}
            helperText={errors.description}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Fields.wrapper>

        <div className="flex gap-3 justify-end mt-4">
          <BeergamButton
            title="Cancelar"
            mainColor="beergam-gray"
            animationStyle="fade"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          />
          <BeergamButton
            title={isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            mainColor="beergam-blue-primary"
            animationStyle="slider"
            disabled={isLoading}
            type="submit"
            fetcher={{
              fecthing: isLoading,
              completed: false,
              error: false,
              mutation: isEditing ? updateMutation : createMutation,
            }}
          />
        </div>
      </form>
    </Modal>
  );
}

