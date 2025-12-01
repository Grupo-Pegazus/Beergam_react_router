import { useState, useEffect } from "react";
import { Button, Chip, Box } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import type { Attribute, CreateAttribute, UpdateAttribute } from "../typings";
import { useCreateAttribute, useUpdateAttribute } from "../hooks";

interface AttributeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribute?: Attribute | null;
}

export default function AttributeFormModal({
  isOpen,
  onClose,
  attribute,
}: AttributeFormModalProps) {
  const isEditing = !!attribute;
  const createMutation = useCreateAttribute();
  const updateMutation = useUpdateAttribute();

  const [formData, setFormData] = useState<CreateAttribute | UpdateAttribute>({
    name: "",
    allowed_values: [],
  });

  const [allowedValueInput, setAllowedValueInput] = useState("");

  const [errors, setErrors] = useState<{ name?: string, allowed_values?: string }>({});

  useEffect(() => {
    if (attribute) {
      setFormData({
        name: attribute.name,
        allowed_values: attribute.allowed_values || [],
      });
    } else {
      setFormData({
        name: "",
        allowed_values: [],
      });
    }
    setAllowedValueInput("");
    setErrors({});
  }, [attribute, isOpen]);

  const validate = (): boolean => {
    const newErrors: { name?: string, allowed_values?: string } = {};

    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = "Nome é obrigatório";
    }

    if (formData.allowed_values && formData.allowed_values.length === 0) {
      newErrors.allowed_values = "Pelo menos um valor é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAllowedValue = () => {
    if (allowedValueInput.trim()) {
      const currentValues = formData.allowed_values || [];
      if (!currentValues.includes(allowedValueInput.trim())) {
        setFormData({
          ...formData,
          allowed_values: [...currentValues, allowedValueInput.trim()],
        });
        setAllowedValueInput("");
      }
    }
  };

  const handleRemoveAllowedValue = (value: string) => {
    const currentValues = formData.allowed_values || [];
    setFormData({
      ...formData,
      allowed_values: currentValues.filter((v) => v !== value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (isEditing && attribute) {
        await updateMutation.mutateAsync({
          attributeId: attribute.id,
          data: formData as UpdateAttribute,
        });
      } else {
        await createMutation.mutateAsync(formData as CreateAttribute);
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
      title={isEditing ? "Editar Atributo" : "Criar Atributo"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Fields.wrapper>
          <Fields.label text="Nome do Atributo" />
          <Fields.input
            type="text"
            placeholder="Ex: Cor, Tamanho, Material"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            error={errors.name}
            disabled={isLoading}
          />
        </Fields.wrapper>

        <Fields.wrapper>
          <Fields.label text="Valores Permitidos (opcional)" />
          <p className="text-xs text-gray-500 mb-2">
            Adicione valores permitidos para este atributo. Ex: Para &quot;Cor&quot; você
            pode adicionar &quot;Vermelho&quot;, &quot;Azul&quot;, &quot;Verde&quot;, etc.
          </p>
          <div className="flex gap-2 mb-2">
            <Fields.input
              placeholder="Digite um valor e pressione Enter"
              value={allowedValueInput}
              onChange={(e) => setAllowedValueInput(e.target.value as string)}
              disabled={isLoading}
              error={errors.allowed_values}
            />
            <Button
              type="button"
              onClick={handleAddAllowedValue}
              disabled={isLoading || !allowedValueInput.trim()}
              variant="outlined"
              sx={{
                borderColor: "var(--color-beergam-blue-primary)",
                color: "var(--color-beergam-blue-primary)",
                minWidth: "100px",
              }}
            >
              Adicionar
            </Button>
          </div>
          {formData.allowed_values && formData.allowed_values.length > 0 && (
            <Box className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg">
              {formData.allowed_values.map((value, index) => (
                <Chip
                  key={index}
                  label={value}
                  onDelete={() => handleRemoveAllowedValue(value)}
                  size="small"
                  sx={{
                    backgroundColor: "#e0e7ff",
                    color: "#3730a3",
                  }}
                />
              ))}
            </Box>
          )}
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

