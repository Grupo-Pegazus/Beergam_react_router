import { useState, useEffect } from "react";
import { Chip, Box } from "@mui/material";
import Modal from "~/src/components/utils/Modal";
import { Fields } from "~/src/components/utils/_fields";
import type { Attribute, CreateAttribute, UpdateAttribute } from "../typings";
import { CreateAttributeSchema, UpdateAttributeSchema } from "../typings";
import { useCreateAttribute, useUpdateAttribute } from "../hooks";
import BeergamButton from "~/src/components/utils/BeergamButton";

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

  const validate = (): { isValid: boolean; errors: { name?: string; allowed_values?: string } } => {
    // Normalizar dados: converter strings vazias em undefined para campos opcionais
    const normalizedData = {
      name: formData.name?.trim() || undefined,
      allowed_values: formData.allowed_values && formData.allowed_values.length > 0 
        ? formData.allowed_values.map(v => v.trim()).filter(v => v.length > 0)
        : undefined,
    };

    const schema = isEditing ? UpdateAttributeSchema : CreateAttributeSchema;
    const result = schema.safeParse(normalizedData);

    if (result.success) {
      setErrors({});
      return { isValid: true, errors: {} };
    }

    const newErrors: { name?: string; allowed_values?: string } = {};
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

    const validation = validate();
    if (!validation.isValid) {
      return;
    }

    // Normalizar dados antes de enviar
    const dataToSend = {
      name: formData.name?.trim(),
      allowed_values: formData.allowed_values && formData.allowed_values.length > 0
        ? formData.allowed_values.map(v => v.trim()).filter(v => v.length > 0)
        : undefined,
    };

    try {
      if (isEditing && attribute) {
        await updateMutation.mutateAsync({
          attributeId: attribute.id,
          data: dataToSend as UpdateAttribute,
        });
      } else {
        await createMutation.mutateAsync(dataToSend as CreateAttribute);
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
          <Fields.label text="Valores Permitidos" />
          <p className="text-xs text-gray-500 mb-2">
            Adicione valores permitidos para este atributo. Ex: Para &quot;Cor&quot; você
            pode adicionar &quot;Vermelho&quot;, &quot;Azul&quot;, &quot;Verde&quot;, etc.
          </p>
          <div className="flex gap-2 mb-2">
            <Fields.input
              placeholder="Digite um valor e pressione Enter"
              value={allowedValueInput}
              onChange={(e) => setAllowedValueInput(e.target.value as string)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  if (allowedValueInput.trim()) {
                    handleAddAllowedValue();
                  }
                }
              }}
              disabled={isLoading}
              error={errors.allowed_values}
            />
            <BeergamButton
              title="Adicionar"
              mainColor="beergam-blue-primary"
              animationStyle="fade"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddAllowedValue();
              }}
              disabled={isLoading || !allowedValueInput.trim()}
              type="button"
              className="min-w-[100px]"
            />
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

