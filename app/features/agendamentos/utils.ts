import {
  SchedulingStatus,
  SchedulingType,
  SchedulingItemsStatus,
  type SchedulingItem,
} from "./typings";

/**
 * Formata a data para exibição em português
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formata a data e hora para exibição em português
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formata o status do agendamento para exibição em português
 */
export function formatSchedulingStatus(
  status: SchedulingStatus
): string {
  const statusMap: Record<SchedulingStatus, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
  };

  return statusMap[status] || status;
}

/**
 * Formata o tipo do agendamento para exibição em português
 */
export function formatSchedulingType(type: SchedulingType): string {
  const typeMap: Record<SchedulingType, string> = {
    ENTRY: "Entrada",
    EXIT: "Saída",
  };

  return typeMap[type] || type;
}

/**
 * Formata o status do item para exibição em português
 */
export function formatItemStatus(status: SchedulingItemsStatus): string {
  const statusMap: Record<SchedulingItemsStatus, string> = {
    PENDING: "Pendente",
    RECEIVED: "Recebido",
    COMPLETED: "Completo",
    CANCELLED: "Cancelado",
    PARTIAL: "Parcial",
    EXCEEDED: "Excedido",
  };

  return statusMap[status] || status;
}

/**
 * Calcula o valor total de um item
 */
export function calculateItemTotal(
  quantity: number,
  unityPrice: string | number
): number {
  const price = typeof unityPrice === "string" ? parseFloat(unityPrice) : unityPrice;
  return quantity * price;
}

/**
 * Calcula o valor total de uma lista de itens
 */
export function calculateItemsTotal(items: SchedulingItem[]): number {
  return items.reduce((total, item) => {
    const itemTotal = parseFloat(item.total_price || "0");
    return total + itemTotal;
  }, 0);
}

/**
 * Formata valor monetário para exibição
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

/**
 * Verifica se um agendamento pode ser editado
 */
export function canEditScheduling(status: SchedulingStatus): boolean {
  return status === SchedulingStatus.PENDING;
}

/**
 * Verifica se um agendamento pode ser cancelado
 */
export function canCancelScheduling(status: SchedulingStatus): boolean {
  return status !== SchedulingStatus.CANCELLED;
}

/**
 * Verifica se um agendamento pode receber baixa
 */
export function canReceiveScheduling(status: SchedulingStatus): boolean {
  return status === SchedulingStatus.PENDING;
}

/**
 * Verifica se um agendamento pode ser deletado
 */
export function canDeleteScheduling(status: SchedulingStatus): boolean {
  return status === SchedulingStatus.PENDING;
}

/**
 * Obtém a cor do status para exibição
 */
export function getStatusColor(status: SchedulingStatus): string {
  const colorMap: Record<SchedulingStatus, string> = {
    PENDING: "warning",
    CONFIRMED: "success",
    CANCELLED: "error",
  };

  return colorMap[status] || "default";
}

/**
 * Obtém a cor do status do item para exibição
 */
export function getItemStatusColor(status: SchedulingItemsStatus): string {
  const colorMap: Record<SchedulingItemsStatus, string> = {
    PENDING: "warning",
    RECEIVED: "info",
    COMPLETED: "success",
    CANCELLED: "error",
    PARTIAL: "warning",
    EXCEEDED: "warning",
  };

  return colorMap[status] || "default";
}

/**
 * Calcula a quantidade total de itens em um agendamento
 */
export function calculateTotalQuantity(items: SchedulingItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Valida se uma data é futura
 */
export function isFutureDate(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
  } catch {
    return false;
  }
}

