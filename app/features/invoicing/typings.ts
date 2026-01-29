import { z } from "zod";
import { OrdersMetricsSchema } from "../vendas/typings";


const AVAILABLE_PERIODS = [30, 60, 90] as const;

export const InvoicingMetricsSchema = z.record(
    z.enum(AVAILABLE_PERIODS.map(String)),
    OrdersMetricsSchema
);

export type InvoicingMetricsSchemaType = z.infer<typeof InvoicingMetricsSchema>;