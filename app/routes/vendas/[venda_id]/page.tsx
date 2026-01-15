import { useMemo } from "react";
import OrderItemCard from "~/features/vendas/components/OrderList/OrderItemCard";
import { useOrderDetails } from "~/features/vendas/hooks";
import {
  CensorshipWrapper,
  TextCensored,
} from "~/src/components/utils/Censorship";
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
    const totalAmount = orders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || "0"),
      0
    );
    const totalQuantity = orders.reduce(
      (sum, order) => sum + (order.quantity || 0),
      0
    );
    let totalLiquido = orders.reduce(
      (sum, order) => sum + parseFloat(order.valor_liquido || "0"),
      0
    );

    if (orders.length > 1) {
      totalLiquido =
        totalLiquido - parseFloat(firstOrder.custo_envio_final || "0");
    }

    return {
      totalAmount,
      totalQuantity,
      totalLiquido,
    };
  }, [orders]);

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
        lucroFinal: 0,
        totalLiquido: 0,
      };
    }

    // Verificar se todos os pedidos estão cancelled
    const allOrdersCancelled = orders.every(
      (order) => order.status?.toLowerCase() === "cancelled"
    );

    // Preço dos produtos = soma de (unit_price * quantity) de cada pedido
    const precoProdutos = orders.reduce((sum, order) => {
      return sum + parseFloat(order.unit_price) * order.quantity;
    }, 0);

    const totalPaid = orders.reduce(
      (sum, order) => sum + parseFloat(order.paid_amount),
      0
    );

    // Se todos os pedidos estão cancelled, não considerar envios e tarifas como negativos
    // Nota: Mantemos os valores de envio para exibição mesmo quando < R$ 79
    // O valor_liquido do backend já está calculado corretamente considerando a regra do R$ 79
    const totalShippingSeller = orders.reduce(
      (sum, order) => sum + parseFloat(order.custo_envio_seller || "0"),
      0
    );
    const totalShippingBuyer = orders.reduce(
      (sum, order) => sum + parseFloat(order.custo_envio_buyer || "0"),
      0
    );
    const totalShippingFinal = orders.reduce(
      (sum, order) => sum + parseFloat(order.custo_envio_final || "0"),
      0
    );

    // Calcular tarifas apenas para pedidos não cancelled
    const totalFees = orders.reduce((sum, order) => {
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
    const custoProduto = orders.reduce(
      (sum, order) => sum + parseFloat(order.price_cost || "0"),
      0
    );
    const custoEmbalagem = orders.reduce(
      (sum, order) => sum + parseFloat(order.packaging_cost || "0"),
      0
    );
    const custosExtras = orders.reduce(
      (sum, order) => sum + parseFloat(order.extra_cost || "0"),
      0
    );
    const impostos = orders.reduce(
      (sum, order) => sum + parseFloat(order.tax_amount || "0"),
      0
    );

    // Lucro final = total receita - custos
    // Se todos os pedidos estão cancelled, lucro final é 0
    const lucroFinal = allOrdersCancelled
      ? 0
      : totalsP.totalLiquido -
        custoProduto -
        custoEmbalagem -
        custosExtras -
        impostos;

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

  // Get client info (after error check, so we know firstOrder exists)
  const clientNameFinal =
    firstOrder.client?.receiver_name || firstOrder.buyer_nickname;
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
          packId={packId}
          totalItems={packInfo?.total_items || totalsP.totalQuantity}
          orderId={firstOrder.order_id}
          date={formatDate(firstOrder.date_created)}
          status={logisticTypeStatus}
          statusBackgroundColor={logisticTypeBackgroundColor}
          statusColor={logisticTypeColor}
        />

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
            />

            {/* Shipping Summary */}
            <ResumoEnvio
              status={firstOrder.shipment_status || "in_transit"}
              statusLabel={
                getStatusOrderMeliInfo(firstOrder.shipment_status)?.label ||
                "Desconhecido"
              }
              estimatedDelivery={formatEstimatedDelivery(
                firstOrder.estimated_delivery || firstOrder.date_closed
              )}
              trackingNumber={firstOrder.tracking_number ?? "N/A"}
            />

            {/* Timeline */}
            {timelineItems.length > 0 && (
              <div
                style={{
                  background: "var(--color-beergam-section-background)!",
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
                    <p className="font-bold text-beergam-typography-primary!">
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
                    <p className="font-bold text-beergam-typography-primary!">
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
                    <p className="font-bold text-beergam-typography-primary!">
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
                  <p className="font-bold text-beergam-typography-primary!">
                    Modo de Envio:
                  </p>
                  <p>
                    {getLogisticTypeMeliInfo(firstOrder.shipping_mode ?? "")
                      ?.label || "N/A"}
                  </p>
                </div>
                <div className="flex gap-[0.3rem] mb-[5px]">
                  <p className="font-bold text-beergam-typography-primary!">
                    Frete Pago Por:
                  </p>
                  <p>
                    {getShippingPaidByLabel(firstOrder.shipping_paid_by) ||
                      "N/A"}
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
              valorTotalVenda={totals.totalPaid}
              receitaBruta={totalsP.totalAmount}
              envioVendedor={totals.totalShippingSeller}
              envioComprador={totals.totalShippingBuyer}
              envioFinalVendedor={totals.totalShippingFinal}
              tarifaML={totals.tarifaML}
              totalReceita={totalsP.totalLiquido}
              custoProduto={totals.custoProduto}
              custoEmbalagem={totals.custoEmbalagem}
              custosExtras={totals.custosExtras}
              impostos={totals.impostos}
              lucroFinal={totals.lucroFinal}
              produtosNaoCadastrados={produtosNaoCadastrados}
              orderId={firstOrder.order_id}
            />
          </div>
        </div>
      </div>
    </>
  );
}
