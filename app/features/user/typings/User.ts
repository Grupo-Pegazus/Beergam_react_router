// import { MenuConfig, type MenuKeys } from "../menu/typings";
import { z } from "zod";
import { CNPJSchema } from "~/utils/typings/CNPJ";
import { CPFSchema } from "~/utils/typings/CPF";
import { TelefoneSchema } from "~/utils/typings/Telefone";
import { BaseUserSchema, type IBaseUser } from "./BaseUser";
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

// type AvailableMarketPlace = "ml" | "magalu" | "shopee";

// const AllowedViewsSchema = z.record(
//   z.enum(Object.keys(MenuConfig) as [MenuKeys, ...MenuKeys[]]),
//   z.object({
//     active: z.boolean(),
//   })
// );

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
  VALOR_BRUTO_PEDIDO = "Imposto Sobre o Valor Bruto do Pedido",
  VALOR_LIQUIDO_PEDIDO = "Imposto Sobre o Valor Líquido do Pedido",
  VALOR_BRUTO_COM_FRETE_RECEBIDO_PEDIDO = "Imposto Sobre o Valor Bruto Com o Frete Recebido",
  VALOR_BRUTO_SEM_FRETE_PAGO_PELO_VENDEDOR_PEDIDO = "Imposto Sobre o Valor Bruto Sem o Frete do Vendedor",
  VALOR_PORCENTAGEM_FIXA = "Imposto Sobre uma Porcentagem Fixa",
}

export enum CurrentBilling {
  BLING = "Bling",
  TINY = "Tiny",
  OTHER = "Outro",
}

type MarketplaceSells = number | null;

export interface PlanBenefits {
  ML_accounts: number;
  colab_accounts: number;
}

export interface Plan {
  display_name: string;
  price: number;
  benefits: PlanBenefits;
}

export interface Subscription {
  start_date: Date;
  end_date: Date;
  free_trial_until: Date;
  plan: Plan;
}

export interface IUserDetails {
  email: string;
  cpf?: string | null;
  cnpj?: string | null;
  phone: string;
  profit_range?: ProfitRange | null;
  found_beergam?: ComoConheceu | null;
  personal_reference_code?: string;
  referral_code?: string | null;
  social_media?: string | null;
  foundation_date?: Date | null;
  address?: string | null;
  secondary_phone?: string | null;
  number_of_employees?: NumberOfEmployees | null;
  notify_newsletter?: boolean | null; //TODO: Aqui não pode ser nulo, só false ou true
  segment?: Segment | null;
  calc_profit_product?: CalcProfitProduct | null;
  calc_tax?: CalcTax | null;
  current_billing?: CurrentBilling | null;
  website?: string | null;
  tax_percent_fixed?: number | null;
  sells_meli?: MarketplaceSells;
  sells_shopee?: MarketplaceSells;
  sells_amazon?: MarketplaceSells;
  sells_shein?: MarketplaceSells;
  sells_own_site?: MarketplaceSells;
  sub_count?: number | null;
  colabs?: IBaseUser[] | object | null;
  subscriptions?: Subscription[] | null;
}
export interface IUser extends IBaseUser {
  details: IUserDetails;
}

const BeergamCodeSchema = z.string().min(10).max(10);

export const PlanBenefitsSchema = z.object({
  ML_accounts: z.number(),
  colab_accounts: z.number(),
}) satisfies z.ZodType<PlanBenefits>;

export const PlanSchema = z.object({
  display_name: z.string(),
  price: z.number(),
  benefits: PlanBenefitsSchema,
}) satisfies z.ZodType<Plan>;

const DateCoerced = z.coerce
  .date()
  .refine((d) => !isNaN(d.getTime()), "Data inválida");

const SubscriptionSchema = z.object({
  start_date: DateCoerced,
  end_date: DateCoerced,
  free_trial_until: DateCoerced,
  plan: PlanSchema,
});

export const UserDetailsSchema = z.object({
  email: z.email("Email inválido"),
  cpf: CPFSchema.optional().nullable(),
  cnpj: CNPJSchema.optional().nullable(),
  phone: TelefoneSchema,
  personal_reference_code: BeergamCodeSchema.optional(),
  referral_code: BeergamCodeSchema.optional().nullable(),
  profit_range: z
    .enum(Object.keys(ProfitRange) as [ProfitRange, ...ProfitRange[]])
    .optional()
    .nullable(),
  found_beergam: z
    .enum(Object.keys(ComoConheceu) as [ComoConheceu, ...ComoConheceu[]])
    .optional()
    .nullable(),
  subscriptions: z.array(SubscriptionSchema).optional().nullable(),
}) satisfies z.ZodType<IUserDetails>;

export const UserSchema = BaseUserSchema.extend({
  details: UserDetailsSchema,
}) satisfies z.ZodType<IUser>;
