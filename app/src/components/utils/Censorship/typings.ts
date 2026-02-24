const PREDEFINED_HOME_KEYS = [
  "home_summary",
  "home_summary_faturamento_bruto",
  "home_summary_lucro_liquido",
  "home_summary_margem_percentual",
  "home_summary_vendas",
  "home_summary_ticket_medio",
  "home_summary_lucro_medio",
  "home_summary_canceladas",
  "home_summary_canceladas_valor_total",
  "perguntas_sla",
  "perguntas_sla_tempo_medio",
  "perguntas_sla_dentro_de_1h",
  "perguntas_sla_pendentes",
  "perguntas_sla_total_periodo",
  "reclamacoes_resumo",
  "resumo_anuncios",
  "resumo_anuncios_categorias",
  "resumo_anuncios_total_anuncios",
  "resumo_anuncios_estoque_baixo",
  "resumo_anuncios_a_melhorar",
  "resumo_top_anuncios_vendidos",
  "resumo_top_anuncios_vendidos_1",
  "resumo_top_anuncios_vendidos_2",
  "resumo_top_anuncios_vendidos_3",
  "resumo_top_anuncios_vendidos_4",
  "resumo_top_anuncios_vendidos_5",
  "visitas_conta",
] as const;

const PREDEFINED_VENDAS_KEYS = [
  "vendas_resumo",
  "vendas_resumo_status_prontas_para_enviar",
  "vendas_resumo_status_pendentes",
  "vendas_resumo_status_em_transito",
  "vendas_resumo_status_concluidas",
  "vendas_resumo_faturamento_bruto",
  "vendas_resumo_faturamento_liquido",
  "vendas_resumo_media_faturamento_diario",
  "vendas_faturamento_diario",
  "vendas_distribuicao_geografica",
  "vendas_orders_list",
  "vendas_orders_list_details",
  "vendas_orders_list_details_endereco",
] as const;

const PREDEFINED_ANUNCIOS_KEYS = [
  "anuncios_list",
  "anuncios_list_details_financial",
] as const;

const PREDEFINED_PRODUTOS_KEYS = [
  "produtos_list",
  "produtos_list_details",
  "produtos_list_details_financial",
] as const;

const PREDEFINED_RECLAMACOES_KEYS = [
  "reclamacoes_tempo_medio_resolucao",
  "reclamacoes_abertas",
  "reclamacoes_fechadas",
  "reclamacoes_total_periodo",
  "reclamacoes_tendencia",
] as const;

const PREDEFINED_LUCRATIVIDADE_KEYS = [
  "lucratividade_faturamento",
  "lucratividade_flex",
  "lucratividade_custos",
  "lucratividade_distribuicao_vendas",
  "lucratividade_lucro_sku",
] as const;

const PREDEFINED_PARETO_KEYS = [
  "pareto_resumo",
  "pareto_skus",
] as const;

/**
 * Lista de chaves pré-definidas para inicialização do sistema de censura.
 * Todas as chaves serão criadas com valor padrão `false` se não existirem.
 */
export const PREDEFINED_CENSORSHIP_KEYS = [
  ...PREDEFINED_HOME_KEYS,
  ...PREDEFINED_VENDAS_KEYS,
  ...PREDEFINED_ANUNCIOS_KEYS,
  ...PREDEFINED_PRODUTOS_KEYS,
  ...PREDEFINED_RECLAMACOES_KEYS,
  ...PREDEFINED_LUCRATIVIDADE_KEYS,
  ...PREDEFINED_PARETO_KEYS,
] as const;

/**
 * Tipo inferido a partir da lista de chaves pré-definidas.
 * Não é necessário definir manualmente - é inferido automaticamente.
 */
export type TPREDEFINED_CENSORSHIP_KEYS =
  (typeof PREDEFINED_CENSORSHIP_KEYS)[number];
