import { z } from "zod";
import { CNPJSchema } from "~/utils/typings/CNPJ";
import { CPFSchema } from "~/utils/typings/CPF";
import { TelefoneSchema } from "~/utils/typings/Telefone";
import { MenuConfig, type MenuKeys, type MenuState } from "../menu/typings";

export type Faixaprofit_rangeKeys =
  | "ATE_10_MIL"
  | "DE_10_A_30_MIL"
  | "DE_30_A_100_MIL"
  | "DE_100_A_300_MIL"
  | "DE_300_A_500_MIL"
  | "DE_500_A_1_MIL"
  | "MAIS_DE_1_MI";

export const Faixaprofit_range: Record<Faixaprofit_rangeKeys, string> = {
  ATE_10_MIL: "Até 10.000 mil reais",
  DE_10_A_30_MIL: "De 10.000 á 30.000 mil reais",
  DE_30_A_100_MIL: "De 30.000 á 100.000 mil reais",
  DE_100_A_300_MIL: "De 100.000 á 300.000 mil reais",
  DE_300_A_500_MIL: "De 300.000 á 500.000 mil reais",
  DE_500_A_1_MIL: "De 500.000 á 1.000.000 milhão reais",
  MAIS_DE_1_MI: "Mais de um milhão de reais por mês",
};
export type ComoConheceuKeys =
  | "ANUNCIO_FACEBOOK"
  | "ANUNCIO_INSTAGRAM"
  | "ANUNCIO_YOUTUBE"
  | "GOOGLE_BUSCA"
  | "INFLUENCIADOR"
  | "AMIGO_INDICOU"
  | "EVENTO_PRESENCIAL_ONLINE"
  | "PODCAST"
  | "WHATSAPP"
  | "TELEGRAM"
  | "GRUPO_OU_COMUNIDADE_ONLINE"
  | "MATÉRIA_EM_BLOG_OU_SITE"
  | "LINKEDIN"
  | "E_MAIL_MARKETING"
  | "FACULDADE_CURSO"
  | "JA_CONHECIA_A_MARCA"
  | "OUTROS";

export const ComoConheceu: Record<ComoConheceuKeys, string> = {
  ANUNCIO_FACEBOOK: "Anúncio no Facebook",
  ANUNCIO_INSTAGRAM: "Anúncio no Instagram",
  ANUNCIO_YOUTUBE: "Anúncio no YouTube",
  GOOGLE_BUSCA: "Google (busca)",
  INFLUENCIADOR: "Influenciador(a)",
  AMIGO_INDICOU: "Amigo me indicou",
  EVENTO_PRESENCIAL_ONLINE: "Evento presencial ou online",
  PODCAST: "Podcast",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
  GRUPO_OU_COMUNIDADE_ONLINE: "Grupo ou comunidade online",
  MATÉRIA_EM_BLOG_OU_SITE: "Matéria em blog ou site",
  LINKEDIN: "LinkedIn",
  E_MAIL_MARKETING: "E-mail marketing",
  FACULDADE_CURSO: "Conheci na faculdade/curso",
  JA_CONHECIA_A_MARCA: "Já conhecia a marca",
  OUTROS: "Outros",
};

type AvailableMarketPlace = "ml" | "magalu" | "shopee";

export enum UsuarioRoles {
  MASTER = "MASTER",
  COLAB = "COLAB",
}
export const UsuarioRolesKeys = Object.keys(UsuarioRoles) as [
  UsuarioRoles,
  ...UsuarioRoles[],
];

interface IContaMarketPlace {
  id: string;
  marketplace: AvailableMarketPlace;
  nome: string;
  image: string;
}
const ContaMarketplaceSchema = z.object({
  id: z.string(),
  marketplace: z.enum(["ml", "magalu", "shopee"]),
  nome: z.string(),
  image: z.string(),
}) satisfies z.ZodType<IContaMarketPlace>;
const AllowedViewsSchema = z.record(
  z.enum(Object.keys(MenuConfig) as [MenuKeys, ...MenuKeys[]]),
  z.object({
    active: z.boolean(),
  })
);

export interface IBaseUsuario {
  name: string;
  role: UsuarioRoles;
  conta_marketplace?: IContaMarketPlace | null;
  allowed_views?: MenuState;
}

export interface IUsuario extends IBaseUsuario {
  email: string;
  cpf?: string | null;
  cnpj?: string | null;
  phone: string;
  personal_reference_code?: string;
  referral_code?: string | null;
  profit_range?: Faixaprofit_rangeKeys | null;
  found_beergam?: ComoConheceuKeys | null;
}

const BaseUserSchema = z.object({
  name: z
    .string()
    .regex(
      /^[a-zA-Z0-9-\s]{3,20}$/,
      "O nome deve ter entre 3 e 20 caracteres e conter apenas letras, números, espaços ou -."
    )
    .refine((value) => !/^\d+$/.test(value), {
      message: "O nome não pode ser apenas números.",
    })
    .min(3, "Nome precisa ter 3 caracteres")
    .max(20, "Nome não pode ter mais de 20 caracteres"),
  role: z.enum(Object.keys(UsuarioRoles) as [UsuarioRoles, ...UsuarioRoles[]]),
  conta_marketplace: ContaMarketplaceSchema.nullable().nullish().optional(),
  allowed_views: AllowedViewsSchema.optional(),
}) satisfies z.ZodType<IBaseUsuario>;

const NewUser: IBaseUsuario = {
  name: "a123456789",
  allowed_views: {
    inicio: { active: true },
    atendimento: { active: true },
    anuncios: { active: true },
  },
  role: UsuarioRoles.MASTER,
  conta_marketplace: {
    id: "1",
    marketplace: "ml",
    nome: "Mercado Livre",
    image: "https://mla-s2-p.mlstatic.com/869034-MLA80043982303_102024-O.jpg",
  },
};

const BeergamCodeSchema = z.string().min(10).max(10);

export const UsuarioTeste = BaseUserSchema.parse(NewUser);
export const UserSchema = BaseUserSchema.extend({
  email: z.email("Email inválido"),
  cpf: CPFSchema.optional().nullable(),
  cnpj: CNPJSchema.optional().nullable(),
  phone: TelefoneSchema,
  personal_reference_code: BeergamCodeSchema.optional(),
  referral_code: BeergamCodeSchema.optional().nullable(),
  profit_range: z
    .enum(
      Object.keys(Faixaprofit_range) as [
        Faixaprofit_rangeKeys,
        ...Faixaprofit_rangeKeys[],
      ]
    )
    .optional()
    .nullable(),
  found_beergam: z
    .enum(
      Object.keys(ComoConheceu) as [ComoConheceuKeys, ...ComoConheceuKeys[]]
    )
    .optional()
    .nullable(),
}) satisfies z.ZodType<IUsuario>;
