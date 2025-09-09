import { z } from "zod";
export type UserType = "master" | "colaborador" | "beergam_master";

type AvailableMarketPlace = "ml" | "magalu" | "shopee";
interface IContaMarketPlace {
    id: string;
    marketplace: AvailableMarketPlace;
}


export type FaixaFaturamentoKeys =
  | "ATE_10_MIL"
  | "DE_10_A_30_MIL"
  | "DE_30_A_100_MIL"
  | "DE_100_A_300_MIL"
  | "DE_300_A_500_MIL"
  | "DE_500_A_1_MIL"
  | "MAIS_DE_1_MI";

export const FaixaFaturamento: Record<FaixaFaturamentoKeys, string> = {
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

interface IBaseUsuario {
  nome: string;
  senha: string;
  user_type: UserType;
  conta_marketplace?: IContaMarketPlace;
}

interface IUsuarioMaster extends IBaseUsuario {
    user_type: "master";
    faixa_faturamento: FaixaFaturamentoKeys;
    como_conheceu: ComoConheceuKeys;
}

const baseUserSchema = z.object({
    nome: z.string(),
    senha: z.string(),
    user_type: z.enum(["master", "colaborador", "beergam_master"]),
    conta_marketplace: z.object({
        id: z.string(),
        marketplace: z.enum(["ml", "magalu", "shopee"]),
    }),
}) satisfies z.ZodType<IBaseUsuario>;

const masterUserSchema = baseUserSchema.extend({
    user_type: z.literal("master"),
    faixa_faturamento: z.enum(["ATE_10_MIL", "DE_10_A_30_MIL", "DE_30_A_100_MIL", "DE_100_A_300_MIL", "DE_300_A_500_MIL", "DE_500_A_1_MIL", "MAIS_DE_1_MI"]),
    como_conheceu: z.enum(["ANUNCIO_FACEBOOK", "ANUNCIO_INSTAGRAM", "ANUNCIO_YOUTUBE", "GOOGLE_BUSCA", "INFLUENCIADOR", "AMIGO_INDICOU", "EVENTO_PRESENCIAL_ONLINE", "PODCAST", "WHATSAPP", "TELEGRAM", "GRUPO_OU_COMUNIDADE_ONLINE", "MATÉRIA_EM_BLOG_OU_SITE", "LINKEDIN", "E_MAIL_MARKETING", "FACULDADE_CURSO", "JA_CONHECIA_A_MARCA", "OUTROS"]),
}) satisfies z.ZodType<IUsuarioMaster>;
