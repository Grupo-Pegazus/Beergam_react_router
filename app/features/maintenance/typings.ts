import type { MenuKeys } from "../menu/typings";

/**
 * Identificador de tela para verificação de manutenção.
 * Pode ser uma chave de primeiro nível (ex: "anuncios") 
 * ou um caminho completo incluindo dropdowns (ex: "produtos.cadastro.cadastro_simplificado").
 * 
 * Exemplos válidos:
 * - "inicio"
 * - "vendas"
 * - "anuncios"
 * - "produtos"
 * - "produtos.gestao"
 * - "produtos.cadastro.cadastro_simplificado"
 * - "produtos.cadastro.cadastro_completo"
 * - "produtos.categorias"
 * - "atendimento.mercado_livre.perguntas"
 * - "atendimento.mercado_livre.reclamacoes"
 * - "atendimento.mercado_livre.mensagens"
 * - "calculadora"
 */
export type TScreenId = MenuKeys | `${MenuKeys}.${string}` | string;

export type TMaintenanceStatus = {
  screen_id: TScreenId;
  is_maintenance: boolean;
  message: string;
};