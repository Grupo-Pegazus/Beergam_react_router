import type { Client } from "../typings";
import { MarketplaceType } from "~/features/marketplace/typings";

/**
 * Clientes mock para desenvolvimento e testes.
 * Usados quando o backend não retorna clientes (ex: ambiente de teste sem dados).
 *
 * Para desabilitar os mocks, defina USE_MOCK_CLIENTS = false ou remova
 * a verificação no useMemo da página de chat.
 */
export const USE_MOCK_CLIENTS = true;

export const MOCK_CLIENTS: Client[] = [
    {
        client_id: "mock-client-001",
        nickname: "João Silva (Mock)",
        receiver_name: "João Carlos da Silva",
        receiver_document: {
            id: "doc_cpf",
            value: "123.456.789-00",
        },
        orders: ["mock-order-1001", "mock-order-1002"],
        claims: ["mock-claim-2001"],
        total_orders: 2,
        total_spent: 45990,
        marketplace_type: MarketplaceType.MELI,
        marketplace_shop_id: "mock-shop-1",
        tags: ["Reclamação aberta", "Pós-venda aberta"],
    },
    {
        client_id: "mock-client-002",
        nickname: "Maria Santos (Mock)",
        receiver_name: "Maria Fernanda Santos",
        receiver_document: {
            id: "doc_cpf",
            value: "987.654.321-00",
        },
        orders: ["mock-order-2001"],
        claims: [],
        total_orders: 1,
        total_spent: 12990,
        marketplace_type: MarketplaceType.MELI,
        marketplace_shop_id: "mock-shop-1",
        tags: ["Pós-venda bloqueada"],
    },
    {
        client_id: "mock-client-003",
        nickname: "Pedro Costa (Mock)",
        receiver_name: "Pedro Henrique Costa",
        receiver_document: {
            id: "doc_cpf",
            value: "456.789.123-00",
        },
        orders: ["mock-order-3001", "mock-order-3002", "mock-order-3003"],
        claims: ["mock-claim-3001", "mock-claim-3002"],
        total_orders: 3,
        total_spent: 89900,
        marketplace_type: MarketplaceType.MELI,
        marketplace_shop_id: "mock-shop-1",
        tags: ["Reclamação fechada", "Pós-venda aberta"],
    },
];
