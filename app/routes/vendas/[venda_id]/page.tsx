import { useMemo } from "react";
import OrderItemCard from "~/features/vendas/components/OrderList/OrderItemCard";
import { useOrderDetails, useOrdersReprocessQuota, useReprocessOrders } from "~/features/vendas/hooks";
import {
  CensorshipWrapper,
  TextCensored,
} from "~/src/components/utils/Censorship";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Alert from "~/src/components/utils/Alert";
import type { ModalOptions } from "~/src/components/utils/Modal/ModalContext";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import { getShippingPaidByLabel } from "~/src/constants/shipping-paid-by-meli";
import { getStatusOrderMeliInfo } from "~/src/constants/status-order-meli";
import AnaliseFinanceira from "./components/AnaliseFinanceira/AnaliseFinanceira";
import ClienteCard from "./components/ClienteCard/ClienteCard";
import DetalhesEnvio from "./components/DetalhesEnvio/DetalhesEnvio";
import PagamentoHeader from "./components/PagamentoHeader/PagamentoHeader";
import PedidoHeader from "./components/PedidoHeader/PedidoHeader";
import ResumoEnvio from "./components/ResumoEnvio/ResumoEnvio";
import Timeline from "./components/Timeline/Timeline";
import VendaDetailsSkeleton from "./components/VendaDetailsSkeleton/VendaDetailsSkeleton";
import styles from "./page.module.css";
import { Box, Stack } from "@mui/material";
interface VendasPageProps {
  venda_id?: string;
}

export default function VendasPage({ venda_id }: VendasPageProps) {
  // Fetch order details from API
  const {
    data: orderDetailsResponse,
    isLoading,
    error,
  } = useOrderDetails(venda_id || "");
  const { data: quotaData } = useOrdersReprocessQuota();
  const reprocessMutation = useReprocessOrders();
  const { openModal, closeModal } = useModal();

  // Extract data from response
  const orders = useMemo(
    () => orderDetailsResponse?.data?.orders || [],
    [orderDetailsResponse]
  );
  const packInfo = useMemo(
    () => orderDetailsResponse?.data?.pack_info,
    [orderDetailsResponse]
  );
  const timelineEvents = useMemo(
    () => orderDetailsResponse?.data?.timeline_events || [],
    [orderDetailsResponse]
  );

  // Format date helpers (defined before useMemo that use them)
  const getMonthName = (month: number) => {
    const months = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];
    return months[month];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${getMonthName(date.getMonth())} ${hours}h${minutes}`;
  };

  const formatEstimatedDelivery = (dateString: string) => {
    const date = new Date(dateString);
    const days = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = getMonthName(date.getMonth());
    return `${dayName} dia ${day} de ${month}`;
  };

  // Get the first order for pack info (safe access)
  const firstOrder = orders[0];

  const totalsP = useMemo(() => {
    const totalAmount = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.total_amount || "0");
    }, 0);
    const totalQuantity = orders.reduce((sum: number, order) => {
      return sum + (order.quantity || 0);
    }, 0);
    let totalLiquido = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.valor_liquido || "0");
    }, 0);

    if (orders.length > 1 && firstOrder) {
      totalLiquido =
        totalLiquido - parseFloat(firstOrder.custo_envio_final || "0");
    }

    // Cálculo do bônus flex de acordo com a regra de R$ 79
    // Regra (para pedidos SELF_SERVICE):
    // - Pedidos com valor total >= 79: usar apenas bonus_por_envio_estorno
    // - Pedidos com valor total < 79: usar custo_envio_base
    // Para outros modos de envio, usamos bonus_por_envio_estorno normalmente
    const bonusFlex =
      (() => {
        if (!firstOrder) return 0;

        const isSelfService = firstOrder.shipping_mode === "self_service";
        const totalPedido = parseFloat(firstOrder.total_amount || "0");
        const bonusPorEnvioEstorno = parseFloat(
          firstOrder.bonus_por_envio_estorno || "0"
        );
        const custoEnvioBase = parseFloat(
          firstOrder.custo_envio_base || "0"
        );

        if (!isSelfService) {
          return bonusPorEnvioEstorno;
        }

        if (totalPedido >= 79) {
          return bonusPorEnvioEstorno;
        }

        return custoEnvioBase;
      })();

    return {
      totalAmount,
      totalQuantity,
      totalLiquido,
      bonusFlex,
    };
  }, [orders, firstOrder]);

  // Calculate totals for the pack
  const totals = useMemo(() => {
    if (!firstOrder || orders.length === 0) {
      return {
        totalItems: 0,
        precoProdutos: 0,
        totalRevenue: 0,
        totalPaid: 0,
        totalShippingSeller: 0,
        totalShippingBuyer: 0,
        totalShippingFinal: 0,
        totalFees: 0,
        tarifaML: 0,
        receitaBruta: 0,
        totalReceita: 0,
        totalFinal: 0,
        custoProduto: 0,
        custoEmbalagem: 0,
        custosExtras: 0,
        impostos: 0,
        meli_flex_shipping_fee: 0,
        lucroFinal: 0,
        totalLiquido: 0,
        bonusFlex: 0,
      };
    }

    // Verificar se todos os pedidos estão cancelled
    const allOrdersCancelled = orders.every(
      (order) => order.status?.toLowerCase() === "cancelled"
    );

    // Preço dos produtos = soma de (unit_price * quantity) de cada pedido
    const precoProdutos = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.unit_price) * order.quantity;
    }, 0);

    const totalPaid = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.paid_amount);
    }, 0);

    // Se todos os pedidos estão cancelled, não considerar envios e tarifas como negativos
    // Nota: Mantemos os valores de envio para exibição mesmo quando < R$ 79
    // O valor_liquido do backend já está calculado corretamente considerando a regra do R$ 79
    const totalShippingSeller = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.custo_envio_seller || "0");
    }, 0);
    const totalShippingBuyer = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.custo_envio_buyer || "0");
    }, 0);
    const totalShippingFinal = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.custo_envio_final || "0");
    }, 0);

    // Calcular tarifas apenas para pedidos não cancelled
    const totalFees = orders.reduce((sum: number, order) => {
      if (order.status?.toLowerCase() === "cancelled") {
        return sum; // Não adicionar tarifa de pedidos cancelled
      }
      return sum + parseFloat(order.sale_fee);
    }, 0);

    // Tarifa ML corresponde ao sale_fee informado por pedido (sem ajustes adicionais)
    const tarifaML = totalFees;

    // Calcular totalLiquido igual ao packageTotals: soma dos valor_base menos custo_envio_final do primeiro pedido

    // Receita bruta = total pago - envio comprador

    // Total receita = valor_liquido do backend (já calculado com todas as deduções)
    // O backend já aplica a regra do R$ 79 e calcula tudo corretamente

    // Total final (conforme Mercado Livre): Preço dos produtos - Tarifa de venda total - Envios (custo final)

    // Custos - usar valores do backend
    const custoProduto = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.price_cost || "0");
    }, 0);
    const custoEmbalagem = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.packaging_cost || "0");
    }, 0);
    const custosExtras = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.extra_cost || "0");
    }, 0);
    const impostos = orders.reduce((sum: number, order) => {
      return sum + parseFloat(order.tax_amount || "0");
    }, 0);

    // Lucro final: soma dos profits retornados pelo backend
    const lucroFinal = allOrdersCancelled
      ? 0
      : orders.reduce((sum: number, order) => sum + (parseFloat(String(order.profit || 0))), 0);

    return {
      precoProdutos,
      totalPaid,
      totalShippingSeller,
      totalShippingBuyer,
      totalShippingFinal,
      totalFees,
      tarifaML,
      custoProduto,
      custoEmbalagem,
      custosExtras,
      impostos,
      lucroFinal,
    };
  }, [orders, firstOrder, packInfo]);

  // Create timeline items from timeline_events
  const timelineItems = useMemo(() => {
    if (!timelineEvents || timelineEvents.length === 0) {
      return [];
    }
    return timelineEvents.map((event) => ({
      title: event.status,
      date: formatDate(event.date),
      description: event.substatus || event.status,
      location: undefined,
    }));
  }, [timelineEvents]);

  // Get products not registered
  const produtosNaoCadastrados = useMemo(() => {
    return orders
      .filter((order) => !order.isRegisteredInternally)
      .map((order) => ({
        nome: order.title,
        sku: order.sku || null,
      }));
  }, [orders]);

  // Payment info (mantido para quando o backend retornar)
  // TODO: Quando o backend retornar payment_id, payment_date e payment_status no pack_info, usar esses valores
  const paymentId = "84576616865"; // Valor padrão até o backend retornar
  const paymentDate = firstOrder?.date_closed || "";
  const showPaymentHeader = false; // Esconder por enquanto até o backend retornar

  // Create order item cards
  const orderItemCards = useMemo(() => {
    if (!orders.length) return [];
    return orders.map((order) => (
      <OrderItemCard
        key={order.order_id}
        censorshipKey="vendas_orders_list_details"
        order={order}
      />
    ));
  }, [orders]);

  // Loading state
  if (isLoading) {
    return <VendaDetailsSkeleton />;
  }

  // Error state
  if (
    error ||
    !orderDetailsResponse?.success ||
    !orders.length ||
    !firstOrder
  ) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>
          Erro ao carregar detalhes do pedido:{" "}
          {error?.message || "Pedido não encontrado"}
        </p>
      </div>
    );
  }

  // Get the first order for pack info (after error check, so we know firstOrder exists)
  const packId = packInfo?.pack_id || firstOrder.pack_id;
  const remainingQuota = quotaData?.success ? quotaData.data?.remaining ?? 0 : 0;
  const orderIdsToReprocess = orders.map((o) => o.order_id).filter(Boolean);

  // Get client info (after error check, so we know firstOrder exists)
  const clientNameFinal =
    firstOrder.client?.receiver_name || firstOrder.buyer_nickname || "Desconhecido";
  const clientDocFinal =
    firstOrder.client?.receiver_document?.value || firstOrder.buyer_id;
  // If clientDocFinal is buyer_id, set type to "Buyer ID", otherwise determine if it's CPF or CNPJ
  const clientDocType =
    clientDocFinal === firstOrder.buyer_id
      ? "Buyer ID"
      : firstOrder.client?.receiver_document?.id ||
      (clientDocFinal.replace(/\D/g, "").length === 14 ? "CNPJ" : "CPF");

  // Get logistic type status and colors
  const logisticTypeInfo = getLogisticTypeMeliInfo(
    firstOrder.shipping_mode ?? ""
  );
  const logisticTypeStatus = logisticTypeInfo?.label || "Não especificado";
  const logisticTypeBackgroundColor =
    logisticTypeInfo?.backgroundColor || "#f3f4f6";
  const logisticTypeColor = logisticTypeInfo?.color || "#374151";

  return (
    <>
      <div style={{ padding: "20px", margin: "0 auto", width: "100%" }}>
        {/* Header */}
        <PedidoHeader
          packId={packId ?? null}
          totalItems={packInfo?.total_items || totalsP.totalQuantity}
          orderId={firstOrder.order_id}
          date={formatDate(firstOrder.date_created as string)}
          status={logisticTypeStatus || ""}
          statusBackgroundColor={logisticTypeBackgroundColor}
          statusColor={logisticTypeColor}
        />

        {/* Ações */}
        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              p: 2,
              borderRadius: 2,
              border: "1px solid rgba(148, 163, 184, 0.25)",
              backgroundColor: "rgba(148, 163, 184, 0.08)",
            }}
          >
            <div>
              <p className="text-sm font-semibold text-beergam-typography-primary">
                Reprocessamento
              </p>
              <p className="text-xs text-beergam-typography-secondary">
                Cota disponível: {remainingQuota} (mês atual)
              </p>
            </div>
            <BeergamButton
              title={reprocessMutation.isPending ? "Reprocessando..." : "Reprocessar pedido(s)"}
              mainColor="beergam-orange"
              animationStyle="slider"
              loading={reprocessMutation.isPending}
              disabled={
                reprocessMutation.isPending ||
                remainingQuota <= 0 ||
                orderIdsToReprocess.length === 0 ||
                orderIdsToReprocess.length > 30
              }
              onClick={() => {
                if (!orderIdsToReprocess.length) {
                  return;
                }
                if (orderIdsToReprocess.length > 30) {
                  return;
                }
                if (remainingQuota < orderIdsToReprocess.length) {
                  return;
                }
                const identifier = packId || firstOrder.order_id;
                const options: ModalOptions = {
                  title: "Confirmar reprocessamento do pedido",
                };

                openModal(
                  <Alert
                    type="info"
                    confirmText="Reprocessar"
                    onClose={closeModal}
                    onConfirm={() => {
                      reprocessMutation.mutate(orderIdsToReprocess);
                    }}
                  >
                    <h3 className="text-lg font-semibold text-beergam-typography-primary mb-2">
                      Reprocessar {orderIdsToReprocess.length} pedido(s) de{" "}
                      #{identifier}?
                    </h3>
                    <p className="text-sm text-beergam-typography-secondary mb-2">
                      Isso irá buscar novamente os dados desses pedidos no Mercado Livre e atualizar os registros aqui no Beergam.
                    </p>
                    <p className="text-xs text-beergam-typography-secondary">
                      Cota mensal: <strong>{quotaData?.data?.limit ?? 0}</strong> | Usados:{" "}
                      <strong>{quotaData?.data?.used ?? 0}</strong> | Restantes:{" "}
                      <strong>{remainingQuota}</strong>.
                    </p>
                  </Alert>,
                  options
                );
              }}
            />
          </Box>
        </Stack>
        {/* Main Layout - Two Columns */}
        <div className={styles.orderDetailsLayout}>
          {/* Left Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Client Card */}
            <ClienteCard
              name={clientNameFinal}
              doc={clientDocFinal}
              docType={clientDocType}
              orderId={firstOrder.order_id}
            />

            {/* Shipping Summary */}
            <ResumoEnvio
              status={firstOrder.shipment_status || "in_transit"}
              statusLabel={
                getStatusOrderMeliInfo(firstOrder.shipment_status)?.label ||
                "Desconhecido"
              }
              estimatedDelivery={formatEstimatedDelivery(
                (firstOrder.estimated_delivery || firstOrder.date_closed) as string
              )}
              trackingNumber={firstOrder.tracking_number ?? "N/A"}
            />

            {/* Timeline */}
            {timelineItems.length > 0 && (
              <div
                style={{
                  background: "var(--color-beergam-section-background)",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Timeline items={timelineItems} />
              </div>
            )}

            {/* Order Items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {orderItemCards}
            </div>

            {/* Shipping Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              <CensorshipWrapper censorshipKey="vendas_orders_list_details_endereco">
                <DetalhesEnvio title="Endereço">
                  <div className="flex gap-[0.3rem] mb-[5px]">
                    <p className="text-sm font-semibold text-beergam-typography-primary">
                      Endereço:
                    </p>
                    <TextCensored
                      className="text-beergam-typography-secondary!"
                      censorshipKey="vendas_orders_list_details_endereco"
                    >
                      {firstOrder.shipping_details?.address_line || "N/A"}
                    </TextCensored>
                  </div>
                  <div className="flex gap-[0.3rem] mb-[5px]">
                    <p className="text-sm font-semibold text-beergam-typography-primary">
                      Bairro:
                    </p>
                    <TextCensored
                      className="text-beergam-typography-secondary!"
                      censorshipKey="vendas_orders_list_details_endereco"
                    >
                      {firstOrder.shipping_details?.neighborhood || "N/A"}
                    </TextCensored>
                  </div>
                  <div className="flex gap-[0.3rem] mb-[5px]">
                    <p className="text-sm font-semibold text-beergam-typography-primary">
                      Estado:
                    </p>
                    <TextCensored
                      className="text-beergam-typography-secondary!"
                      censorshipKey="vendas_orders_list_details_endereco"
                    >
                      {firstOrder.shipping_destination_state || "N/A"}
                    </TextCensored>
                  </div>
                </DetalhesEnvio>
              </CensorshipWrapper>
              <DetalhesEnvio title="Entrega">
                {/* <LabelText label="Método" text={firstOrder.tracking_method || "N/A"} /> */}
                <div className="flex gap-[0.3rem] mb-[5px]">
                  <p className="text-sm font-semibold text-beergam-typography-primary">
                    Modo de Envio:
                  </p>
                  <p className="text-sm font-medium text-beergam-typography-primary">
                    {getLogisticTypeMeliInfo(firstOrder.shipping_mode ?? "")
                      ?.label || "N/A"}
                  </p>
                </div>
                <div className="flex gap-[0.3rem] mb-[5px]">
                  <p className="text-sm font-semibold text-beergam-typography-primary">
                    Frete Pago Por:
                  </p>
                  <p className="text-sm font-medium text-beergam-typography-primary">
                    {getShippingPaidByLabel(firstOrder.shipping_paid_by)}
                  </p>
                </div>
              </DetalhesEnvio>
            </div>
          </div>

          {/* Right Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "sticky",
              top: "20px",
            }}
          >
            {/* Payment Header - Escondido por enquanto */}
            {showPaymentHeader && (
              <PagamentoHeader
                paymentId={paymentId}
                date={formatDate(paymentDate)}
                status="FULL"
              />
            )}

            {/* Financial Analysis */}
            <AnaliseFinanceira
              receitaBruta={totalsP.totalAmount}
              envioVendedor={totals.totalShippingSeller}
              envioComprador={totals.totalShippingBuyer}
              bonusFlex={totalsP.bonusFlex ?? 0}
              envioFinalVendedor={totals.totalShippingFinal}
              tarifaML={totals.tarifaML}
              totalReceita={totalsP.totalLiquido}
              custoProduto={totals.custoProduto}
              custoEmbalagem={totals.custoEmbalagem}
              custosExtras={totals.custosExtras}
              impostos={totals.impostos}
              lucroFinal={totals.lucroFinal}
              meli_flex_shipping_fee={parseFloat(String(firstOrder.meli_flex_shipping_fee || 0))}
              produtosNaoCadastrados={produtosNaoCadastrados}
              orderId={firstOrder.order_id}
            />
          </div>
        </div>
      </div >
    </>
  );
}
