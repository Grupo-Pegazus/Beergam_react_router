import { Chip } from "@mui/material";
import type { StockSyncDashboardResponse } from "../../typings";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";

interface SyncAccountInfoProps {
  accountInfo: StockSyncDashboardResponse["account_info"];
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Não disponível";
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SyncAccountInfo({
  accountInfo,
}: SyncAccountInfoProps) {
  return (
    <MainCards className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Informações da Conta
          </h3>
          <Chip
            label={accountInfo.marketplace_name}
            size="small"
            sx={{
              backgroundColor: "#dbeafe",
              color: "#1e40af",
              fontWeight: 600,
            }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500 mb-1">ID da Loja</p>
            <p className="text-sm font-semibold text-slate-900">
              {accountInfo.marketplace_shop_id}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Tipo de Conta</p>
            <p className="text-sm font-semibold text-slate-900">
              {accountInfo.account_type}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">User Products</p>
            <div className="flex items-center gap-2">
              {accountInfo.user_product_seller ? (
                <>
                  <Svg.check_circle tailWindClasses="h-5 w-5 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-600">
                    Habilitado
                  </p>
                </>
              ) : (
                <>
                  <Svg.x_circle tailWindClasses="h-5 w-5 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-500">
                    Não habilitado
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Última Detecção</p>
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(accountInfo.last_detection)}
            </p>
          </div>
        </div>
      </div>
    </MainCards>
  );
}

