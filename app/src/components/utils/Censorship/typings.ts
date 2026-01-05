/**
 * Lista de chaves pré-definidas para inicialização do sistema de censura.
 * Todas as chaves serão criadas com valor padrão `false` se não existirem.
 */
export const PREDEFINED_CENSORSHIP_KEYS = [
  "home_summary",
  "home_summary_faturamento_bruto",
  "home_summary_lucro_liquido",
  "home_summary_margem_percentual",
  "home_summary_vendas",
  "home_summary_ticket_medio",
  "home_summary_lucro_medio",
  "home_summary_canceladas",
  "home_summary_canceladas_valor_total",
  "vendas_resumo",
  "vendas_resumo_status_prontas_para_enviar",
  "vendas_resumo_status_em_transito",
  "vendas_resumo_status_concluidas",
  "vendas_resumo_faturamento_bruto_90d",
  "vendas_resumo_faturamento_liquido_90d",
  "vendas_resumo_media_faturamento_diario_90d",
] as const;

/**
 * Tipo inferido a partir da lista de chaves pré-definidas.
 * Não é necessário definir manualmente - é inferido automaticamente.
 */
export type TPREDEFINED_CENSORSHIP_KEYS =
  (typeof PREDEFINED_CENSORSHIP_KEYS)[number];
