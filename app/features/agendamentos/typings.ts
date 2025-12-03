import { z } from "zod";

// Enums
export enum SchedulingType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
}

export enum SchedulingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum SchedulingItemsStatus {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  PARTIAL = "PARTIAL",
  EXCEEDED = "EXCEEDED",
}

export enum SchedulingLogsAction {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
  CANCELLED = "CANCELLED",
}

// Schema para item de agendamento
const SchedulingItemSchema = z.object({
  id: z.number(),
  product_id: z.string().nullable(),
  product_variation_id: z.string().nullable(),
  quantity: z.number(),
  unity_price: z.string(),
  total_price: z.string(),
  status: z.nativeEnum(SchedulingItemsStatus),
  received_quantity: z.number().nullable(),
  difference_quantity: z.number().nullable(),
  received_date: z.string().nullable(),
  title: z.string().optional().nullable(), // Título do produto/variação
});

export type SchedulingItem = z.infer<typeof SchedulingItemSchema>;

// Schema para log de agendamento
const SchedulingLogSchema = z.object({
  id: z.number(),
  actor_pin: z.string(),
  is_master: z.boolean(),
  actor_name: z.string(),
  action: z.nativeEnum(SchedulingLogsAction),
  description: z.string(),
  created_at: z.string(),
  meta: z.record(z.string(), z.unknown()).nullable(),
});

export type SchedulingLog = z.infer<typeof SchedulingLogSchema>;

// Schema para agendamento completo (com items e logs)
const SchedulingSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.nativeEnum(SchedulingType),
  estimated_arrival_date: z.string(),
  status: z.nativeEnum(SchedulingStatus),
  user_pin: z.string(),
  observation: z.string().nullable(),
  created_by_actor_pin: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  items: z.array(SchedulingItemSchema),
});

export type Scheduling = z.infer<typeof SchedulingSchema>;

// Schema para agendamento na listagem (sem items e logs)
const SchedulingListSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.nativeEnum(SchedulingType),
  estimated_arrival_date: z.string(),
  status: z.nativeEnum(SchedulingStatus),
  user_pin: z.string(),
  observation: z.string().nullable(),
  created_by_actor_pin: z.string(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  items_count: z.number(),
});

export type SchedulingList = z.infer<typeof SchedulingListSchema>;

// Schema para resposta de listagem
export const SchedulingsResponseSchema = z.object({
  schedulings: z.array(SchedulingListSchema),
  pagination: z.object({
    page: z.number(),
    per_page: z.number(),
    total_count: z.number(),
    total_pages: z.number(),
    has_next: z.boolean(),
    has_prev: z.boolean(),
  }),
  filters_applied: z.record(z.string(), z.unknown()).optional(),
});

export type SchedulingsResponse = z.infer<typeof SchedulingsResponseSchema>;

// Schema para resposta de agendamento único
export const SchedulingResponseSchema = SchedulingSchema;

export type SchedulingResponse = z.infer<typeof SchedulingResponseSchema>;

// Schema para filtros
export const SchedulingFiltersSchema = z.object({
  type: z.nativeEnum(SchedulingType).optional(),
  status: z.nativeEnum(SchedulingStatus).optional(),
  scheduling_id: z.string().optional(),
  product_id: z.string().optional(),
  title: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  page: z.number().default(1),
  per_page: z.number().default(20).refine((val) => val <= 100, {
    message: "per_page deve ser no máximo 100",
  }),
  sort_by: z.string().default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export type SchedulingFilters = z.infer<typeof SchedulingFiltersSchema>;

// Schema para criação de agendamento
export const CreateSchedulingItemSchema = z.object({
  product_id: z.string().optional(),
  product_variation_id: z.string().optional(),
  quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
  unity_price: z.string().or(z.number()),
});

export type CreateSchedulingItem = z.infer<typeof CreateSchedulingItemSchema>;

export const CreateSchedulingSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  type: z.nativeEnum(SchedulingType),
  estimated_arrival_date: z.string(),
  observation: z.string().optional(),
  items: z
    .array(CreateSchedulingItemSchema)
    .min(1, "Agendamento deve ter pelo menos um item"),
});

export type CreateScheduling = z.infer<typeof CreateSchedulingSchema>;

// Schema para atualização de agendamento
export const UpdateSchedulingSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres").optional(),
  estimated_arrival_date: z.string().optional(),
  observation: z.string().optional(),
});

export type UpdateScheduling = z.infer<typeof UpdateSchedulingSchema>;

// Schema para cancelamento
export const CancelSchedulingSchema = z.object({
  reason: z.string().min(2, "Motivo deve ter pelo menos 2 caracteres").max(500, "Motivo deve ter no máximo 500 caracteres"),
});

export type CancelScheduling = z.infer<typeof CancelSchedulingSchema>;

// Schema para item de recebimento
const ReceiptItemSchema = z.object({
  item_id: z.number().min(1, "ID do item é obrigatório"),
  received_quantity: z.number().min(1, "Quantidade recebida deve ser maior que zero"),
});

// Schema para recebimento
export const ReceiveSchedulingSchema = z.object({
  items: z.array(ReceiptItemSchema).min(1, "Deve ter pelo menos um item para recebimento"),
  force_without_sync: z.boolean().default(false),
});

export type ReceiveScheduling = z.infer<typeof ReceiveSchedulingSchema>;

// Schema para resposta de logs
export const SchedulingLogsResponseSchema = z.object({
  logs: z.array(SchedulingLogSchema),
  total: z.number(),
});

export type SchedulingLogsResponse = z.infer<typeof SchedulingLogsResponseSchema>;

