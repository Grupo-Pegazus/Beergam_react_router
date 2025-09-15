import { z } from "zod";
import { MenuConfig, type MenuKeys, type MenuState } from "../menu/typings";
// export interface SellerContas {
//   account_name: string;
//   conta_ml_hash: string;
//   account_image: string;
// }

z.config({
  customError: (iss) => {
    switch (iss.code) {
      case "invalid_type":
        return `O Campo ${iss.path?.join(".")} está inválido, esperado ${iss.expected}`;
      case "invalid_value":
        return `O Campo ${iss.path?.join(".")} está inválido, esperado: ${iss.values.join(", ")}`;
      case "too_small":
        return iss.minimum !== undefined
          ? `O Campo ${iss.path?.join(".")} precisa ser maior que ${iss.minimum} caracteres`
          : "valor muito pequeno";
      case "too_big":
        return iss.maximum !== undefined
          ? `O Campo ${iss.path?.join(".")} está inválido, valor informado ${iss.maximum}`
          : "valor muito grande";
      case "invalid_format":
        return `O Campo ${iss.path?.join(".")} está inválido, valor informado ${iss.format}`;
      default:
        return "entrada inválida";
    }
  },
});

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

// class Usuario implements IUsuario {
//   nome: string;
//   user_type: "master";
//   email: string;
//   cpf: string | null;
//   cnpj: string | null;
//   whatsapp: string;
//   referred_code: string;
//   referal_code: string;
//   faturamento: FaixaFaturamentoKeys;
//   conheceu_beergam: ComoConheceuKeys;
//   allowed_views: MenuState;
//   conta_marketplace?: ContaML;
//   constructor(usuario: IUsuario) {
//     this.nome = usuario.nome;
//     this.user_type = "master";
//     this.email = usuario.email;
//     this.cpf = usuario.cpf;
//     this.cnpj = usuario.cnpj;
//     this.whatsapp = usuario.whatsapp;
//     this.referred_code = usuario.referred_code;
//     this.referal_code = usuario.referal_code;
//     this.faturamento = usuario.faturamento;
//     this.conheceu_beergam = usuario.conheceu_beergam;
//     this.allowed_views = usuario.allowed_views;
//     this.conta_marketplace = new ContaML(
//       usuario.conta_marketplace ?? { nome: "", image: "" }
//     );
//   }
//   validarUsuario(
//     usuario: IUsuario,
//     final: boolean = false,
//     documento: "cpf" | "cnpj" = "cpf"
//   ) {
//     const erros: string[] = [];
//     const nome = this.validarNome(usuario.nome, final);
//     const camposComErro = [];
//     if (!nome.valid) {
//       erros.push(nome.message as string);
//       camposComErro.push("nome");
//     }
//     const email = this.validarEmail(usuario.email, final);
//     if (!email.valid) {
//       erros.push(email.message as string);
//       camposComErro.push("email");
//     }
//     const cpf = new CPF(usuario.cpf ?? "").validarCPF(usuario.cpf ?? "", final);
//     if (!cpf.valid && documento === "cpf") {
//       erros.push(cpf.message as string);
//       camposComErro.push("cpf");
//     }
//     if (!cnpj.valid && documento === "cnpj") {
//       erros.push(cnpj.message as string);
//       camposComErro.push("cnpj");
//     }
//     return {
//       valid: erros.length === 0,
//       message: erros.length === 0 ? "" : erros,
//       camposComErro: camposComErro,
//     };
//   }
//   validarNome(nome: string, final: boolean = false) {
//     if (nome.length == 0 && !final) {
//       return {
//         valid: true,
//         message: "",
//       };
//     }
//     if (nome.length == 0 && final) {
//       return {
//         valid: false,
//         message: "Nome é obrigatório",
//       };
//     }
//     if (nome.length < 3) {
//       return {
//         valid: false,
//         message: "Nome deve ter no mínimo 3 caracteres",
//       };
//     }
//     if (nome.length > 20) {
//       return {
//         valid: false,
//         message: "Nome deve ter no máximo 20 caracteres",
//       };
//     }
//     return {
//       valid: true,
//       message: "",
//     };
//   }
//   validarEmail(email: string, final: boolean = false) {
//     if (email.length > 0 && !final) {
//       return {
//         valid: true,
//         message: "",
//       };
//     }
//     if (email.length == 0 && final) {
//       return {
//         valid: false,
//         message: "Email é obrigatório",
//       };
//     }
//     if (!email.includes("@")) {
//       return {
//         valid: false,
//         message: "Email inválido",
//       };
//     }
//     if (email.length < 3) {
//       return {
//         valid: false,
//         message: "Email deve ter no mínimo 3 caracteres",
//       };
//     }
//     if (email.length > 50) {
//       return {
//         valid: false,
//         message: "Email deve ter no máximo 50 caracteres",
//       };
//     }
//     return {
//       valid: true,
//       message: "",
//     };
//   }
//   static validarSenha(senha: string, final: boolean = false) {
//     if (senha.length > 0 && !final) {
//       return {
//         valid: true,
//         message: "",
//       };
//     }

//     if (!senha) {
//       return {
//         valid: false,
//         message: "A senha não pode estar vazia.",
//       };
//     }

//     if (senha.length < 8) {
//       return {
//         valid: false,
//         message: "A senha deve ter pelo menos 8 caracteres.",
//       };
//     }

//     if (!/[A-Z]/.test(senha)) {
//       return {
//         valid: false,
//         message: "A senha deve conter pelo menos uma letra maiúscula.",
//       };
//     }

//     if (!/[a-z]/.test(senha)) {
//       return {
//         valid: false,
//         message: "A senha deve conter pelo menos uma letra minúscula.",
//       };
//     }

//     if (!/\d/.test(senha)) {
//       return {
//         valid: false,
//         message: "A senha deve conter pelo menos um número.",
//       };
//     }

//     if (!/[!@#$%^&*]/.test(senha)) {
//       return {
//         valid: false,
//         message: "A senha deve conter pelo menos um caractere especial",
//       };
//     }

//     return {
//       valid: true,
//       message: "Senha válida",
//     };
//   }
// }

// const ContaMlTeste = new ContaML({
//   nome: "Conta ML Teste",
//   image: "https://mla-s2-p.mlstatic.com/869034-MLA80043982303_102024-O.jpg",
// });

// export const UsuarioTeste = new Usuario({
//   nome: "Jorge",
//   cnpj: "12345678901234",
//   cpf: "12345678901",
//   email: "jorge@gmail.com",
//   whatsapp: "12345678901",
//   referred_code: "12345678901",
//   referal_code: "12345678901",
//   faturamento: "ATE_10_MIL",
//   conheceu_beergam: "ANUNCIO_FACEBOOK",
//   allowed_views: { ...getDefaultViews(), inicio: { active: true } },
//   user_type: "master",
//   conta_marketplace: ContaMlTeste,
// });
type AvailableMarketPlace = "ml" | "magalu" | "shopee";

interface IContaMarketPlace {
  id: string;
  marketplace: AvailableMarketPlace;
}
const ContaMarketplaceSchema = z.object({
  id: z.string(),
  marketplace: z.enum(["ml", "magalu", "shopee"]),
}) satisfies z.ZodType<IContaMarketPlace>;
const AllowedViewsSchema = z.record(
  z.enum(Object.keys(MenuConfig) as [MenuKeys, ...MenuKeys[]]),
  z.object({
    active: z.boolean(),
  })
);

export type UserType = "master" | "colaborador" | "beergam_master";

export interface IUsuario extends IBaseUsuario {
  email: string;
  cpf: string | null;
  cnpj: string | null;
  whatsapp: string;
  referred_code: string;
  referal_code: string;
  faturamento: FaixaFaturamentoKeys;
  conheceu_beergam: ComoConheceuKeys;
}

export interface IBaseUsuario {
  nome: string;
  user_type: UserType;
  conta_marketplace?: IContaMarketPlace;
  allowed_views: MenuState;
}

const UserPasswordSchema = z
  .string()
  .min(8)
  .max(30)
  .refine((senha: string) => {
    if (!/[A-Z]/.test(senha)) {
      return { message: "A senha deve ter pelo menos uma letra maiúscula" };
    }
    if (!/[a-z]/.test(senha)) {
      return { message: "A senha deve ter pelo menos uma letra minúscula" };
    }
    if (!/\d/.test(senha)) {
      return { message: "A senha deve ter pelo menos um número" };
    }
    if (!/[!@#$%^&*]/.test(senha)) {
      return { message: "A senha deve ter pelo menos um caractere especial" };
    }
  });

const BaseUserSchema = z.object({
  nome: z.string().min(10).max(30),
  user_type: z.enum(["master", "colaborador", "beergam_master"]),
  conta_marketplace: ContaMarketplaceSchema,
  allowed_views: AllowedViewsSchema,
}) satisfies z.ZodType<IBaseUsuario>;
const NewUser: IBaseUsuario = {
  nome: "a",
  allowed_views: {
    inicio: { active: true },
    atendimento: { active: true },
    anuncios: { active: true },
  },
  user_type: "master",
  conta_marketplace: {
    id: "1",
    marketplace: "ml",
  },
};

const NewUserObject = BaseUserSchema.safeParse(NewUser);
console.log(NewUserObject);
