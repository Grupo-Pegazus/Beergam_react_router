import z from "zod";
import { typedApiClient } from "../apiClient/client";
import type { ApiResponse } from "../apiClient/typings";
import { MarketplaceType } from "../marketplace/typings";
import {
  MarketplaceReputationSchemas,
  type MarketplaceReputationData,
  type MarketplaceReputationPayload,
  MeliScheduleSchema,
  type MarketplaceScheduleData,
  type MarketplaceSchedulePayload,
  MeliVisitsSchema,
  type MarketplaceVisitsData,
  type MarketplaceVisitsPayload,
} from "./typings";

const BaseReputationSchema = z.object({
  marketplace_shop_id: z.string(),
  marketplace_type: z.nativeEnum(MarketplaceType),
  reputation: z.unknown(),
});

type RawReputationData = z.infer<typeof BaseReputationSchema>;

class MetricsAccountService {
  async getReputationAccount<T extends MarketplaceType>(
    marketplaceType: T,
  ): Promise<ApiResponse<MarketplaceReputationData<T>>> {
    try {
      const response = await typedApiClient.get<RawReputationData>(
        "/v1/metrics-account/reputation",
      );

      if (!response.success || !response.data) {
        return {
          ...response,
          data: {
            marketplace_shop_id: "",
            marketplace_type: marketplaceType,
            reputation: {} as MarketplaceReputationPayload<T>,
          },
        };
      }

      const parsedBase = BaseReputationSchema.safeParse(response.data);
      if (!parsedBase.success) {
        console.error("Formato inesperado para reputação:", parsedBase.error);
        return {
          ...response,
          data: {
            marketplace_shop_id: "",
            marketplace_type: marketplaceType,
            reputation: {} as MarketplaceReputationPayload<T>,
          },
        };
      }

      const schema = MarketplaceReputationSchemas[marketplaceType];
      const parsedReputation = schema.parse(
        parsedBase.data.reputation,
      ) as MarketplaceReputationPayload<T>;

      return {
        ...response,
        data: {
          marketplace_shop_id: parsedBase.data.marketplace_shop_id,
          marketplace_type: marketplaceType,
          reputation: parsedReputation,
        },
      };
    } catch (error) {
      console.error("error do getReputationAccount", error);
      return {
        success: false,
        data: {
          marketplace_shop_id: "",
          marketplace_type: marketplaceType,
          reputation: {} as MarketplaceReputationPayload<T>,
        },
        message:
          "Erro ao buscar reputação da conta. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  async getScheduleTimes<T extends MarketplaceType>(
    marketplaceType: T,
  ): Promise<ApiResponse<MarketplaceScheduleData<T>>> {
    try {
      const response = await typedApiClient.get<unknown>(
        "/v1/metrics-account/schedule_times",
      );

      if (!response.success || !response.data) {
        return {
          ...response,
          data: {
            marketplace_shop_id: "",
            marketplace_type: marketplaceType,
            schedule: {} as MarketplaceSchedulePayload<T>,
          },
        };
      }

      // MELI tipado, demais marketplaces: passthrough
      if (marketplaceType === MarketplaceType.MELI) {
        const parsed = MeliScheduleSchema.parse(response.data);
        return {
          ...response,
          data: {
            marketplace_shop_id: parsed.marketplace_shop_id,
            marketplace_type: marketplaceType,
            schedule: parsed as MarketplaceSchedulePayload<T>,
          },
        };
      }

      const data = response.data as {
        marketplace_shop_id?: string;
      };
      return {
        ...response,
        data: {
          marketplace_shop_id: data?.marketplace_shop_id ?? "",
          marketplace_type: marketplaceType,
          schedule: response.data as MarketplaceSchedulePayload<T>,
        },
      };
    } catch (error) {
      console.error("error do getScheduleTimes", error);
      return {
        success: false,
        data: {
          marketplace_shop_id: "",
          marketplace_type: marketplaceType,
          schedule: {} as MarketplaceSchedulePayload<T>,
        },
        message:
          "Erro ao buscar horários de corte. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }

  async getVisits<T extends MarketplaceType>(
    marketplaceType: T,
    seriesWindows: number[] = [90],
  ): Promise<ApiResponse<MarketplaceVisitsData<T>>> {
    try {
      const params = new URLSearchParams();
      seriesWindows.forEach((window) => {
        params.append("series_windows", window.toString());
      });

      const response = await typedApiClient.get<unknown>(
        `/v1/metrics-account/visits?${params.toString()}`,
      );

      if (!response.success || !response.data) {
        return {
          ...response,
          data: {
            marketplace_shop_id: "",
            marketplace_type: marketplaceType,
            visits: {} as MarketplaceVisitsPayload<T>,
          },
        };
      }

      if (marketplaceType === MarketplaceType.MELI) {
        const parsed = MeliVisitsSchema.parse(response.data);
        return {
          ...response,
          data: {
            marketplace_shop_id: parsed.marketplace_shop_id,
            marketplace_type: marketplaceType,
            visits: parsed as MarketplaceVisitsPayload<T>,
          },
        };
      }

      // Fallback para outros marketplaces
      const data = response.data as { marketplace_shop_id?: string };
      return {
        ...response,
        data: {
          marketplace_shop_id: data?.marketplace_shop_id ?? "",
          marketplace_type: marketplaceType,
          visits: response.data as MarketplaceVisitsPayload<T>,
        },
      };
    } catch (error) {
      console.error("error do getVisits", error);
      return {
        success: false,
        data: {
          marketplace_shop_id: "",
          marketplace_type: marketplaceType,
          visits: {} as MarketplaceVisitsPayload<T>,
        },
        message:
          "Erro ao buscar dados de visitas. Tente novamente em alguns instantes.",
        error_code: 500,
        error_fields: {},
      };
    }
  }
}

export const metricsAccountService = new MetricsAccountService();
