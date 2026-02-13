import { Typography } from "@mui/material";
import { Link } from "react-router";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import MainCards from "~/src/components/ui/MainCards";
import {
  CensorshipWrapper,
  ImageCensored,
  TextCensored,
  useCensorship,
} from "~/src/components/utils/Censorship";
import type { Order } from "~/features/vendas/typings";
import Svg from "~/src/assets/svgs/_index";

interface RelatorioVendasOrderCardProps {
  order: Order;
}

/** Card compacto para exibição de pedido no relatório de vendas em mobile */
export default function RelatorioVendasOrderCard({ order }: RelatorioVendasOrderCardProps) {
  const { isCensored } = useCensorship();
  const censored = isCensored("vendas_orders_list");

  const profitStr = String(order.profit ?? "");
  const isNegativeProfit = profitStr.includes("-");

  return (
    <Link to={`/interno/vendas/${order.order_id}`} className="block w-full min-w-0">
      <MainCards className="p-3 w-full min-w-0 rounded-xl overflow-hidden active:opacity-90 transition-opacity">
        <CensorshipWrapper censorshipKey="vendas_orders_list" canChange={false}>
          <div className="flex gap-3 w-full min-w-0">
            {/* Thumbnail + info principal */}
            <div className="flex shrink-0">
              <ImageCensored
                className="w-14 h-14 shrink-0 rounded-lg overflow-hidden"
                censorshipKey="vendas_orders_list"
              >
                <Thumbnail
                  thumbnail={order.thumbnail ?? ""}
                  tailWindClasses="w-14 h-14 shrink-0 object-cover"
                />
              </ImageCensored>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Typography
                  variant="caption"
                  className="font-mono text-xs text-beergam-typography-secondary!"
                >
                  #{order.order_id}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-xs text-beergam-typography-tertiary! whitespace-nowrap"
                >
                  {order.date_created ?? "—"}
                </Typography>
              </div>

              <TextCensored forceCensor={censored} censorshipKey="vendas_orders_list">
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="text-beergam-typography-primary! text-sm line-clamp-2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {order.title ?? "—"}
                </Typography>
              </TextCensored>

              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                <span className="text-beergam-typography-secondary!">
                  Bruto: <strong className="text-beergam-typography-primary!">{order.total_amount ?? "—"}</strong>
                </span>
                <span className="text-beergam-typography-secondary!">
                  Líquido: <strong className="text-beergam-typography-primary!">{order.valor_liquido ?? "—"}</strong>
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-xs">
                  Lucro:{" "}
                  <strong
                    className={
                      isNegativeProfit ? "text-beergam-red!" : "text-beergam-green-primary!"
                    }
                  >
                    {order.profit ?? "—"}
                  </strong>
                </span>
                {order.profit_margin != null && (
                  <span
                    className={`text-xs font-semibold ${
                      isNegativeProfit ? "text-beergam-red!" : "text-beergam-green-primary!"
                    }`}
                  >
                    {order.profit_margin}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center">
              <Svg.chevron
                tailWindClasses="w-5 h-5 text-beergam-typography-tertiary! rotate-90"
              />
            </div>
          </div>
        </CensorshipWrapper>
      </MainCards>
    </Link>
  );
}
