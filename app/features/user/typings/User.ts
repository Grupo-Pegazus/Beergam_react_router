// import { MenuConfig, type MenuKeys } from "../menu/typings";
import { z } from "zod";
import { CNPJSchema } from "~/utils/typings/CNPJ";
import { CPFSchema } from "~/utils/typings/CPF";
import { TelefoneSchema } from "~/utils/typings/Telefone";
import type { IBaseUserDetails } from "./BaseUser";
import {
  BaseUserDetailsSchema,
  BaseUserSchema,
  type IBaseUser,
} from "./BaseUser";
import { ColabSchema, type IColab } from "./Colab";
export enum ProfitRange {
  ATE_10_MIL = "Até 10.000 mil reais",
  DE_10_A_30_MIL = "De 10.000 á 30.000 mil reais",
  DE_30_A_100_MIL = "De 30.000 á 100.000 mil reais",
  DE_100_A_300_MIL = "De 100.000 á 300.000 mil reais",
  DE_300_A_500_MIL = "De 300.000 á 500.000 mil reais",
  DE_500_A_1_MIL = "De 500.000 á 1.000.000 milhão reais",
  MAIS_DE_1_MI = "Mais de um milhão de reais por mês",
}

export enum ComoConheceu {
  ANUNCIO_FACEBOOK = "Anúncio no Facebook",
  ANUNCIO_INSTAGRAM = "Anúncio no Instagram",
  ANUNCIO_YOUTUBE = "Anúncio no YouTube",
  GOOGLE_BUSCA = "Google (busca)",
  INFLUENCIADOR = "Influenciador(a)",
  AMIGO_INDICOU = "Amigo me indicou",
  EVENTO_PRESENCIAL_ONLINE = "Evento presencial ou online",
  PODCAST = "Podcast",
  WHATSAPP = "WhatsApp",
  TELEGRAM = "Telegram",
  GRUPO_OU_COMUNIDADE_ONLINE = "Grupo ou comunidade online",
  MATERIA_EM_BLOG_OU_SITE = "Matéria em blog ou site",
  LINKEDIN = "LinkedIn",
  E_MAIL_MARKETING = "E-mail marketing",
  FACULDADE_CURSO = "Conheci na faculdade/curso",
  JA_CONHECIA_A_MARCA = "Já conhecia a marca",
  OUTROS = "Outros",
}

export enum NumberOfEmployees {
  ATE_10 = "Até 10",
  DE_10_A_30 = "De 10 á 30",
  DE_30_A_100 = "De 30 á 100",
  DE_100_A_300 = "De 100 á 300",
  DE_300_A_500 = "De 300 á 500",
  MAIS_DE_500 = "Mais de 500",
}

export enum Segment {
  SEM_NICHO = "Sem Nicho Específico",
  ACESSORIOS_VEICULOS = "Acessórios para Veículos",
  AGRO = "Agro",
  ALIMENTOS_BEBIDAS = "Alimentos e Bebidas",
  PET_SHOP = "Pet Shop",
  ANTIGUIDADES_COLECOES = "Antiguidades e Coleções",
  ARTE_PAPELARIA = "Arte, Papelaria e Armarinho",
  BEBES = "Bebês",
  BELEZA_CUIDADO = "Beleza e Cuidado Pessoal",
  BRINQUEDOS_HOBBIES = "Brinquedos e Hobbies",
  CALCADOS_ROUPAS = "Calçados, Roupas e Bolsas",
  CAMERAS = "Câmeras e Acessórios",
  CARROS_MOTOS = "Carros, Motos e Outros",
  CASA_MOVEIS = "Casa, Móveis e Decoração",
  CELULARES = "Celulares e Telefones",
  CONSTRUCAO = "Construção",
  ELETRODOMESTICOS = "Eletrodomésticos",
  ELETRONICOS = "Eletrônicos, Áudio e Vídeo",
  ESPORTES = "Esportes e Fitness",
  FERRAMENTAS = "Ferramentas",
  FESTAS = "Festas e Lembrancinhas",
  GAMES = "Games",
  INDUSTRIA = "Indústria e Comércio",
  INFORMATICA = "Informática",
  INGRESSOS = "Ingressos",
  INSTRUMENTOS = "Instrumentos Musicais",
  JOIAS = "Joias e Relógios",
  LIVROS = "Livros, Revistas e Comics",
  MUSICA = "Música, Filmes e Seriados",
  SAUDE = "Saúde",
  SERVICOS = "Serviços",
  OUTRAS = "Outras Categorias",
}

export enum CalcProfitProduct {
  CUSTO_FIXO = "Custo Fixo",
  CUSTO_MEDIO_ESTOQUE = "Custo Médio do Estoque",
  DESCONHECIDO = "Desconhecido",
}

export enum CalcTax {
  VALOR_PEDIDO = "Imposto Sobre o Valor Bruto do Pedido",
  VALOR_LIQUIDO_PEDIDO = "Imposto Sobre o Valor Líquido do Pedido",
  VALOR_CLIENTE_PAGOU = "Imposto Sobre o Valor Bruto Com o Frete Recebido",
  VALOR_PORCENTAGEM_FIXA = "Imposto Sobre uma Porcentagem Fixa",
}

export enum CurrentBilling {
  BLING = "Bling",
  TINY = "Tiny",
  OTHER = "Outro",
}

type MarketplaceSells = number | null;
export interface IUserDetails extends IBaseUserDetails {
  email: string;
  cpf?: string | null;
  cnpj?: string | null;
  phone: string;
  profit_range?: ProfitRange | null;
  found_beergam?: ComoConheceu | null;
  personal_reference_code?: string;
  referral_code?: string | null;
  social_media?: string | null;
  foundation_date?: string | null;
  address?: string | null;
  secondary_phone?: string | null;
  number_of_employees?: NumberOfEmployees | null;
  notify_newsletter?: boolean | null; //TODO: Aqui não pode ser nulo, só false ou true
  segment?: Segment | null;
  calc_profit_product?: CalcProfitProduct | null;
  calc_tax?: CalcTax | null;
  current_billing?: CurrentBilling | null;
  website?: string | null;
  tax_percent_fixed?: string | null;
  sells_meli?: MarketplaceSells;
  sells_shopee?: MarketplaceSells;
  sells_amazon?: MarketplaceSells;
  sells_shein?: MarketplaceSells;
  sells_own_site?: MarketplaceSells;
  invoice_in_flex?: boolean | null;
}
export interface IUser extends IBaseUser {
  details: IUserDetails;
  colabs: Record<string, IColab>;
  sub_count: number;
}

const BeergamCodeSchema = z.string().min(10).max(10);
const BeergamReferralCodeSchema = z.string().max(20);

const NumberCoerced = z.preprocess(
  (v) => {
    if (v === null || v === undefined || v === "") return 0;
    return Number(v);
  },
  z.number().min(0, "Número tem que ser maior que 0")
);

/**
 * Helper que transforma string vazia em null antes da validação
 * Útil para campos opcionais que podem ser string vazia do formulário
 */
function nullableField<T extends z.ZodTypeAny>(fieldValue: T) {
  return z
    .preprocess((v) => {
      // Transforma string vazia em null
      if (v === "" || v === null || v === undefined) return null;
      return v;
    }, fieldValue.nullable())
    .optional();
}
export const UserDetailsSchema = BaseUserDetailsSchema.extend({
  email: z.email("Email inválido"),
  cpf: CPFSchema.optional().nullable(),
  cnpj: CNPJSchema.optional().nullable(),
  phone: TelefoneSchema,
  secondary_phone: nullableField(TelefoneSchema),
  personal_reference_code: BeergamCodeSchema.optional(),
  referral_code: BeergamReferralCodeSchema.optional().nullable(),
  profit_range: z
    .enum(Object.keys(ProfitRange) as [ProfitRange, ...ProfitRange[]])
    .optional()
    .nullable(),
  found_beergam: z
    .enum(Object.keys(ComoConheceu) as [ComoConheceu, ...ComoConheceu[]])
    .optional()
    .nullable(),
  notify_newsletter: z.coerce.boolean().optional().nullable(),
  calc_profit_product: nullableField(
    z.enum(
      Object.keys(CalcProfitProduct) as [
        CalcProfitProduct,
        ...CalcProfitProduct[],
      ]
    )
  ),
  calc_tax: z
    .enum(Object.keys(CalcTax) as [CalcTax, ...CalcTax[]])
    .optional()
    .nullable(),
  current_billing: nullableField(
    z.enum(Object.keys(CurrentBilling) as [CurrentBilling, ...CurrentBilling[]])
  ),
  website: z.url("URL inválida").optional().nullable(),
  tax_percent_fixed: z
    .preprocess(
      (v) => {
        if (v === null || v === undefined || v === "") return "0";
        return String(v).replace(/%/g, "");
      },
      z
        .string()
        .refine((v) => {
          // Verifica se é um número após remover o "%"
          const num = Number(String(v).replace(/%/g, ""));
          return !isNaN(num) && v.trim() !== "";
        }, "Valor inválido")
        .refine((v) => {
          const num = Number(v);
          return num >= 0;
        }, "Número tem que ser maior que 0")
        .refine((v) => {
          const num = Number(v);
          return num <= 100;
        }, "Número tem que ser menor que 100")
    )
    .optional()
    .transform((v) => {
      // Adiciona o caractere "%" de volta
      return `${v}`;
    }),
  sells_meli: NumberCoerced,
  sells_shopee: NumberCoerced,
  sells_amazon: NumberCoerced,
  sells_shein: NumberCoerced,
  sells_own_site: NumberCoerced,
  number_of_employees: nullableField(
    z.enum(
      Object.keys(NumberOfEmployees) as [
        NumberOfEmployees,
        ...NumberOfEmployees[],
      ]
    )
  ),
  segment: z
    .enum(Object.keys(Segment) as [Segment, ...Segment[]])
    .optional()
    .nullable(),
  social_media: z.string().optional().nullable(),
  foundation_date: z.string().optional().nullable(),
  invoice_in_flex: z.boolean().optional().nullable(),
}) satisfies z.ZodType<IUserDetails>;

export const UserSchema = BaseUserSchema.extend({
  details: UserDetailsSchema,
  colabs: z.record(z.string(), ColabSchema).default({}),
  sub_count: NumberCoerced,
}) satisfies z.ZodType<IUser>;

export function isAtributeUser(
  attribute: keyof IUser | keyof IUserDetails
): attribute is keyof IUser {
  return attribute in UserSchema.shape;
}
export function isAtributeUserDetails(
  attribute: keyof IUser | keyof IUserDetails
): attribute is keyof IUserDetails {
  return attribute in UserDetailsSchema.shape;
}
