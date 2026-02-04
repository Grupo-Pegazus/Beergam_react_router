import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "../apiClient/typings";
import type { MarketplaceType } from "../marketplace/typings";
import { taxesService } from "./service";
import type { TaxesData, UpsertTaxPayload, UpsertTaxResponse } from "./typings";

export function useUserTaxes(params: {
  marketplace_shop_id?: string | number;
  marketplace_type?: MarketplaceType;
  year?: number;
}) {
  const enabled = Boolean(
    params.marketplace_shop_id && params.marketplace_type && params.year
  );
  return useQuery({
    queryKey: [
      "taxes",
      params.marketplace_shop_id ?? null,
      params.marketplace_type ?? null,
      params.year ?? null,
    ],
    enabled,
    queryFn: async () => {
      const res = await taxesService.getUserTaxes({
        marketplace_shop_id: params.marketplace_shop_id as string | number,
        marketplace_type: params.marketplace_type as MarketplaceType,
        year: params.year as number,
      });
      window.alert(JSON.stringify(res));
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar impostos");
      }
      return res.data as TaxesData;
    },
  });
}

export function useUpsertTax() {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<UpsertTaxResponse["data"]>,
    Error,
    UpsertTaxPayload
  >({
    mutationFn: async (payload) => {
      const res = await taxesService.upsertTax(payload);
      if (!res.success) {
        throw new Error(res.message || "Erro ao salvar imposto");
      }
      return res;
    },
    onSuccess: (_data, variables) => {
      const { marketplace_shop_id, marketplace_type, year } = variables;
      qc.invalidateQueries({
        queryKey: [
          "taxes",
          marketplace_shop_id,
          marketplace_type,
          Number(year),
        ],
      });
    },
  });
}

export function useRecalcStatus(params: { year?: number; month?: number }) {
  const enabled = Boolean(params.year && params.month);
  return useQuery({
    queryKey: ["recalc-status", params.year ?? null, params.month ?? null],
    enabled,
    queryFn: async () => {
      const res = await taxesService.getRecalcStatus({
        year: params.year as number,
        month: params.month as number,
      });
      if (!res.success) {
        throw new Error(res.message || "Erro ao buscar status de recálculo");
      }
      return res.data;
    },
  });
}

export function useRecalculatePeriod() {
  return useMutation<
    ApiResponse<unknown>,
    Error,
    {
      year: number;
      month: number;
      marketplace_shop_id: string;
      marketplace_type: MarketplaceType;
    }
  >({
    mutationFn: async (payload) => {
      const res = await taxesService.recalculatePeriod({
        year: payload.year,
        month: payload.month,
        marketplace_shop_id: payload.marketplace_shop_id,
        marketplace_type: payload.marketplace_type,
      });
      if (!res.success) {
        throw new Error(res.message || "Erro ao iniciar recálculo");
      }
      return res;
    },
  });
}
