import { useMemo } from "react";
import { useOrderDetails } from "~/features/vendas/hooks";
import styles from "./page.module.css";
import PedidoHeader from "./components/PedidoHeader/PedidoHeader";
import ClienteCard from "./components/ClienteCard/ClienteCard";
import ResumoEnvio from "./components/ResumoEnvio/ResumoEnvio";
import Timeline from "./components/Timeline/Timeline";
import PagamentoHeader from "./components/PagamentoHeader/PagamentoHeader";
import AnaliseFinanceira from "./components/AnaliseFinanceira/AnaliseFinanceira";
import DetalhesEnvio from "./components/DetalhesEnvio/DetalhesEnvio";
import LabelText from "./components/LabelText/LabelText";
import ListaItensPedido from "./components/ListaItensPedido/ListaItensPedido";
import OrderItemCard from "~/features/vendas/components/OrderList/OrderItemCard";
import { getStatusOrderMeliInfo } from "~/src/constants/status-order-meli";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
interface VendasPageProps {
    venda_id?: string;
}

export default function VendasPage({ venda_id }: VendasPageProps) {
    // Fetch order details from API
    const { data: orderDetailsResponse, isLoading, error } = useOrderDetails(venda_id || "");

    // Extract data from response
    const orders = useMemo(() => orderDetailsResponse?.data?.orders || [], [orderDetailsResponse]);
    const packInfo = useMemo(() => orderDetailsResponse?.data?.pack_info, [orderDetailsResponse]);
    const timelineEvents = useMemo(() => orderDetailsResponse?.data?.timeline_events || [], [orderDetailsResponse]);

    // Format date helpers (defined before useMemo that use them)
    const getMonthName = (month: number) => {
        const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
        return months[month];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day} ${getMonthName(date.getMonth())} ${hours}h${minutes}`;
    };

    const formatEstimatedDelivery = (dateString: string) => {
        const date = new Date(dateString);
        const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = getMonthName(date.getMonth());
        return `${dayName} dia ${day} de ${month}`;
    };

    // Get the first order for pack info (safe access)
    const firstOrder = orders[0];

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
                totalLiquido: 0
            };
        }

        // Verificar se todos os pedidos estão cancelled
        const allOrdersCancelled = orders.every(order => order.status?.toLowerCase() === "cancelled");
        
        const totalItems = packInfo?.total_items || orders.reduce((sum, order) => sum + order.quantity, 0);
        
        // Preço dos produtos = soma de (unit_price * quantity) de cada pedido
        const precoProdutos = orders.reduce((sum, order) => {
            return sum + (parseFloat(order.unit_price) * order.quantity);
        }, 0);
        
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
        const totalPaid = orders.reduce((sum, order) => sum + parseFloat(order.paid_amount), 0);
        
        // Se todos os pedidos estão cancelled, não considerar envios e tarifas como negativos
        const totalShippingSeller = allOrdersCancelled ? 0 : parseFloat(firstOrder.custo_envio_seller || "0");
        const totalShippingBuyer = allOrdersCancelled ? 0 : parseFloat(firstOrder.custo_envio_buyer || "0");
        const totalShippingFinal = allOrdersCancelled ? 0 : parseFloat(firstOrder.custo_envio_final || "0");
        
        // Calcular tarifas apenas para pedidos não cancelled
        const totalFees = orders.reduce((sum, order) => {
            if (order.status?.toLowerCase() === "cancelled") {
                return sum; // Não adicionar tarifa de pedidos cancelled
            }
            return sum + parseFloat(order.sale_fee);
        }, 0);
        
        // Tarifa ML corresponde ao sale_fee informado por pedido (sem ajustes adicionais)
        const tarifaML = totalFees;
        const totalLiquido = orders.reduce((sum, order) => {
            const liquido = parseFloat(order.valor_liquido || "0");
            return sum + liquido;
        }, 0);

        // Receita bruta = total pago - envio comprador
        const receitaBruta = totalPaid - totalShippingBuyer;

        // Total receita = receita bruta - envio vendedor - tarifa ML
        const totalReceita = receitaBruta - totalShippingFinal - tarifaML;
        
        // Total final (conforme Mercado Livre): Preço dos produtos - Tarifa de venda total - Envios (custo final)
        const totalFinal = precoProdutos - tarifaML - totalShippingFinal;

        // Custos
        const custoProduto = orders.reduce((sum, order) => sum + parseFloat(order.price_cost || "0"), 0);
        const custoEmbalagem = orders.reduce((sum, order) => sum + parseFloat(order.packaging_cost || "0"), 0);
        const custosExtras = orders.reduce((sum, order) => sum + parseFloat(order.extra_cost || "0"), 0);
        const impostos = orders.reduce((sum, order) => sum + parseFloat(order.tax_amount || "0"), 0);

        // Lucro final = total receita - custos
        // Se todos os pedidos estão cancelled, lucro final é 0
        const lucroFinal = allOrdersCancelled ? 0 : (totalLiquido - custoProduto - custoEmbalagem - custosExtras - impostos);

        return {
            totalItems,
            precoProdutos,
            totalRevenue,
            totalPaid,
            totalShippingSeller,
            totalShippingBuyer,
            totalShippingFinal,
            totalFees,
            tarifaML,
            receitaBruta,
            totalReceita,
            totalFinal,
            custoProduto,
            custoEmbalagem,
            custosExtras,
            impostos,
            lucroFinal,
            totalLiquido
        };
    }, [orders, firstOrder, packInfo]);

    // Create timeline items from timeline_events
    const timelineItems = useMemo(() => {
        if (!timelineEvents || timelineEvents.length === 0) {
            return [];
        }
        return timelineEvents.map(event => ({
            title: event.status,
            date: formatDate(event.date),
            description: event.substatus || event.status,
            location: undefined
        }));
    }, [timelineEvents]);

    // Get products not registered
    const produtosNaoCadastrados = useMemo(() => {
        return orders
            .filter(order => !order.isRegisteredInternally)
            .map(order => ({
                nome: order.title,
                sku: order.sku || null
            }));
    }, [orders]);

    // Get client info
    const clientName = firstOrder?.client?.destination_receiver_name || firstOrder?.buyer_nickname || "";
    const clientDoc = firstOrder?.client?.cpf || firstOrder?.buyer_id || "";

    // Payment info (mantido para quando o backend retornar)
    // TODO: Quando o backend retornar payment_id, payment_date e payment_status no pack_info, usar esses valores
    const paymentId = "84576616865"; // Valor padrão até o backend retornar
    const paymentDate = firstOrder?.date_closed || "";
    const paymentStatus = "approved"; // Valor padrão até o backend retornar
    const showPaymentHeader = false; // Esconder por enquanto até o backend retornar

    // Create order item cards
    const orderItemCards = useMemo(() => {
        if (!orders.length) return [];
        return orders.map((order) => (
            <OrderItemCard key={order.order_id} order={order} />
        ));
    }, [orders]);

    // Create items list for right column
    const itemsList = useMemo(() => {
        return orders.map(order => ({
            title: order.title,
            unit_price: parseFloat(order.unit_price),
            quantity: order.quantity
        }));
    }, [orders]);

    // Loading state
    if (isLoading) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Carregando detalhes do pedido...</p>
            </div>
        );
    }

    // Error state
    if (error || !orderDetailsResponse?.success || !orders.length || !firstOrder) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Erro ao carregar detalhes do pedido: {error?.message || "Pedido não encontrado"}</p>
            </div>
        );
    }

    // Get the first order for pack info (after error check, so we know firstOrder exists)
    const packId = packInfo?.pack_id || firstOrder.pack_id;

    // Get client info (after error check, so we know firstOrder exists)
    const clientNameFinal = firstOrder.client?.destination_receiver_name || firstOrder.buyer_nickname;
    const clientDocFinal = firstOrder.client?.cpf || firstOrder.buyer_id;

    return (
        <> 
                <div style={{ padding: "20px", margin: "0 auto", width: "100%" }}>
            {/* Header */}
            <PedidoHeader
                packId={packId || firstOrder.order_id}
                totalItems={packInfo?.total_items || totals.totalItems}
                orderId={firstOrder.order_id}
                date={formatDate(firstOrder.date_created)}
                status="FULL"
            />

            {/* Main Layout - Two Columns */}
            <div className={styles.orderDetailsLayout}>
                {/* Left Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Client Card */}
                    <ClienteCard
                        name={clientNameFinal}
                        doc={clientDocFinal}
                    />

                    {/* Shipping Summary */}
                    <ResumoEnvio
                        status={firstOrder.shipment_status || "in_transit"}
                        statusLabel={getStatusOrderMeliInfo(firstOrder.shipment_status)?.label || "Desconhecido"}
                        estimatedDelivery={formatEstimatedDelivery(firstOrder.estimated_delivery || firstOrder.date_closed)}
                        trackingNumber={firstOrder.tracking_number ?? "N/A"}
                    />

                    {/* Timeline */}
                    {timelineItems.length > 0 && (
                        <div style={{ background: "var(--white)", borderRadius: "15px", padding: "20px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                            <Timeline items={timelineItems} />
                        </div>
                    )}

                    {/* Order Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {orderItemCards}
                    </div>

                    {/* Shipping Details */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                        <DetalhesEnvio icon="endereco">
                            <LabelText label="Endereço" text={firstOrder.shipping_details?.address_line || "N/A"} />
                            <LabelText label="Bairro" text={firstOrder.shipping_details?.neighborhood || "N/A"} />
                            <LabelText label="Estado" text={firstOrder.shipping_destination_state || "N/A"} />
                        </DetalhesEnvio>

                        <DetalhesEnvio icon="entrega">
                            {/* <LabelText label="Método" text={firstOrder.tracking_method || "N/A"} /> */}
                            <LabelText label="Modo de Envio" text={getLogisticTypeMeliInfo(firstOrder.shipping_mode ?? "")?.label || "N/A"} />
                            <LabelText label="Frete Pago Por" text={firstOrder.shipping_paid_by || "N/A"} />
                        </DetalhesEnvio>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "20px" }}>
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
                        receitaBruta={totals.receitaBruta}
                        envioVendedor={totals.totalShippingSeller}
                        envioComprador={totals.totalShippingBuyer}
                        envioFinalVendedor={totals.totalShippingFinal}
                        tarifaML={totals.tarifaML}
                        totalReceita={totals.totalReceita}
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
