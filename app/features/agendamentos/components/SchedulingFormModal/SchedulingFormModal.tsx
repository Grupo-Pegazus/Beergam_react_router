import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { FilterDatePicker } from "~/src/components/filters/components/FilterDatePicker";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";
import { useCreateScheduling, useUpdateScheduling } from "../../hooks";
import type {
  CreateScheduling,
  CreateSchedulingItem,
  Scheduling,
  UpdateScheduling,
} from "../../typings";
import { SchedulingType } from "../../typings";
import { calculateItemTotal, formatCurrency } from "../../utils";
import {
  ProductVariationSelectorModal,
  type SelectedProductVariation,
} from "../ProductVariationSelectorModal";

interface SchedulingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduling?: Scheduling | null;
}

export default function SchedulingFormModal({
  isOpen,
  onClose,
  scheduling,
}: SchedulingFormModalProps) {
  const isEditing = !!scheduling;
  const createMutation = useCreateScheduling();
  const updateMutation = useUpdateScheduling();

  const [showProductSelector, setShowProductSelector] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateScheduling>>({
    title: "",
    type: SchedulingType.ENTRY,
    estimated_arrival_date: "",
    observation: "",
    items: [],
  });

  // Tipo interno para itens no formulário (com title para exibição)
  type FormSchedulingItem = CreateSchedulingItem & {
    title?: string; // Apenas para exibição no formulário
  };

  const [items, setItems] = useState<FormSchedulingItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (scheduling && isOpen) {
      setFormData({
        title: scheduling.title,
        type: scheduling.type,
        estimated_arrival_date: scheduling.estimated_arrival_date,
        observation: scheduling.observation || "",
      });
      // Na edição, não permitimos editar itens
      setItems([]);
    } else if (!scheduling && isOpen) {
      setFormData({
        title: "",
        type: SchedulingType.ENTRY,
        estimated_arrival_date: "",
        observation: "",
      });
      setItems([]);
    }
    setErrors({});
  }, [scheduling, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 2) {
      newErrors.title = "Título deve ter pelo menos 2 caracteres";
    }

    if (!formData.estimated_arrival_date) {
      newErrors.estimated_arrival_date = "Data do evento é obrigatória";
    }

    if (!isEditing && items.length === 0) {
      newErrors.items = "Agendamento deve ter pelo menos um item";
    }

    items.forEach((item, index) => {
      if (!item.product_id && !item.product_variation_id) {
        newErrors[`item_${index}`] = "Item deve ter produto ou variação";
      }
      if (!item.quantity || item.quantity < 1) {
        newErrors[`item_quantity_${index}`] =
          "Quantidade deve ser maior que zero";
      }
      if (!item.unity_price) {
        newErrors[`item_price_${index}`] = "Preço unitário é obrigatório";
      } else {
        // Validar que o preço não seja zero
        const priceValue =
          typeof item.unity_price === "string"
            ? parseFloat(item.unity_price)
            : item.unity_price;
        if (priceValue === 0 || isNaN(priceValue) || priceValue < 0) {
          newErrors[`item_price_${index}`] =
            "Preço unitário deve ser maior que zero";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (isEditing && scheduling) {
        await updateMutation.mutateAsync({
          id: scheduling.id,
          data: formData as UpdateScheduling,
        });
      } else {
        // Remover o campo title dos itens antes de enviar (backend não aceita)
        const itemsToSend: CreateSchedulingItem[] = items.map((item) => ({
          product_id: item.product_id,
          product_variation_id: item.product_variation_id,
          quantity: item.quantity,
          unity_price: item.unity_price,
        }));

        await createMutation.mutateAsync({
          ...formData,
          items: itemsToSend,
        } as CreateScheduling);
      }
      onClose();
    } catch {
      // Erro já é tratado no hook
    }
  };

  const handleAddItems = (selections: SelectedProductVariation[]) => {
    const newItems: FormSchedulingItem[] = selections.map((selection) => {
      const displayTitle =
        selection.title ||
        (selection.product_id
          ? `Produto ${selection.product_id}`
          : `Variação ${selection.product_variation_id}`);

      return {
        product_id: selection.product_id,
        product_variation_id: selection.product_variation_id,
        quantity: 1,
        unity_price: "0.00",
        title: displayTitle, // Apenas para exibição no formulário
      };
    });

    setItems([...items, ...newItems]);
    const newErrors = { ...errors };
    delete newErrors.items;
    setErrors(newErrors);
    setShowProductSelector(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof FormSchedulingItem,
    value: unknown
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? "Editar Agendamento" : "Criar Agendamento"}
        contentClassName="max-w-4xl"
        disableClickAway={showProductSelector}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campos básicos */}
          <Fields.wrapper className="w-full">
            <Fields.label text="Título" required />
            <Fields.input
              type="text"
              placeholder="Ex: Entrada - Fornecedor ABC"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
              disabled={isLoading}
            />
          </Fields.wrapper>

          <Fields.wrapper className="w-full">
            <Fields.label text="Data do evento" required />
            <FilterDatePicker
              label=""
              value={formData.estimated_arrival_date}
              onChange={(value) =>
                setFormData({ ...formData, estimated_arrival_date: value })
              }
              disabled={isLoading}
              includeTime={true}
              widthType="full"
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label text="Tipo" required />
            <Fields.select
              value={formData.type || SchedulingType.ENTRY}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as SchedulingType,
                })
              }
              options={[
                { value: SchedulingType.ENTRY, label: "Entrada" },
                { value: SchedulingType.EXIT, label: "Saída" },
              ]}
              disabled={isLoading || isEditing}
            />
          </Fields.wrapper>

          <Fields.wrapper>
            <Fields.label text="Observação" />
            <TextField
              multiline
              rows={3}
              placeholder="Observações adicionais..."
              value={formData.observation || ""}
              onChange={(e) =>
                setFormData({ ...formData, observation: e.target.value })
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

          {/* Seção de Itens */}
          {!isEditing && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <Fields.label text="Itens do Agendamento" required />
                <BeergamButton
                  title="Adicionar Item"
                  mainColor="beergam-orange"
                  animationStyle="fade"
                  onClick={() => setShowProductSelector(true)}
                  disabled={isLoading}
                  type="button"
                />
              </div>

              {errors.items && (
                <div className="text-red-500 text-sm mb-2">{errors.items}</div>
              )}

              {items.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Produto/Variação</TableCell>
                        <TableCell align="right">Quantidade</TableCell>
                        <TableCell align="right">Preço Unitário</TableCell>
                        <TableCell align="right">Valor Total</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => {
                        const displayTitle =
                          item.title ||
                          (item.product_id
                            ? `Produto ID: ${item.product_id}`
                            : `Variação ID: ${item.product_variation_id}`);
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              {item.product_id ? (
                                <span>
                                  Produto: <b>{displayTitle}</b>
                                </span>
                              ) : (
                                <span>
                                  Variação: <b>{displayTitle}</b>
                                </span>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Fields.input
                                type="number"
                                value={item.quantity || ""}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    "quantity",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                error={errors[`item_quantity_${index}`]}
                                disabled={isLoading}
                                tailWindClasses="w-20"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Fields.input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={item.unity_price || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleItemChange(index, "unity_price", value);
                                  // Validar em tempo real
                                  const priceValue = parseFloat(value);
                                  if (
                                    value &&
                                    (priceValue === 0 ||
                                      isNaN(priceValue) ||
                                      priceValue < 0)
                                  ) {
                                    setErrors({
                                      ...errors,
                                      [`item_price_${index}`]:
                                        "Preço unitário deve ser maior que zero",
                                    });
                                  } else {
                                    const newErrors = { ...errors };
                                    delete newErrors[`item_price_${index}`];
                                    setErrors(newErrors);
                                  }
                                }}
                                error={errors[`item_price_${index}`]}
                                disabled={isLoading}
                                tailWindClasses="w-24"
                              />
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(
                                calculateItemTotal(
                                  item.quantity || 0,
                                  typeof item.unity_price === "string"
                                    ? parseFloat(item.unity_price || "0")
                                    : item.unity_price || 0
                                )
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveItem(index)}
                                disabled={isLoading}
                              >
                                <Svg.circle_x tailWindClasses="w-5 h-5" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-beergam-typography-tertiary!">
                  Nenhum item adicionado. Clique em &quot;Adicionar Item&quot;
                  para começar.
                </div>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 justify-end mt-4 pt-4 border-t">
            <BeergamButton
              title="Fechar"
              mainColor="beergam-gray"
              animationStyle="fade"
              onClick={onClose}
              disabled={isLoading}
              type="button"
            />
            <BeergamButton
              title={
                isLoading ? "Salvando..." : isEditing ? "Salvar" : "Salvar"
              }
              mainColor="beergam-orange"
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

      {/* Modal de seleção de produto */}
      <ProductVariationSelectorModal
        isOpen={showProductSelector}
        onClose={() => setShowProductSelector(false)}
        onSelect={handleAddItems}
        alreadyAddedItems={items.map((item) => ({
          product_id: item.product_id,
          product_variation_id: item.product_variation_id,
        }))}
      />
    </>
  );
}
