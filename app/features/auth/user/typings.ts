import { AllowedViews, getDefaultViews } from "../../menu/typings";
export interface IValidacao {
  valid: boolean;
  message: string | string[];
  camposComErro?: string[];
}

export interface SellerContas {
  account_name: string;
  conta_ml_hash: string;
  account_image: string;
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

export class CPF {
  cpf: string | null;
  constructor(cpf: string) {
    this.cpf = cpf;
  }
  validarCPF(cpf: string, final: boolean = false): IValidacao {
    if (cpf.length == 0 && !final) {
      return {
        valid: true,
        message: "",
      };
    }
    if (cpf.length == 0 && final) {
      return {
        valid: false,
        message: "CPF é obrigatório",
      };
    }
    if (!validateCPF(cpf)) {
      return {
        valid: false,
        message: "CPF inválido",
      };
    }
    return { valid: true, message: "" };
  }
}

function validateCPF(cpf: string) {
  let Soma = 0;
  let Resto;

  const strCPF = String(cpf).replace(/\D/g, "");
  if (strCPF.length !== 11) return false;

  if (
    [
      "00000000000",
      "11111111111",
      "22222222222",
      "33333333333",
      "44444444444",
      "55555555555",
      "66666666666",
      "77777777777",
      "88888888888",
      "99999999999",
    ].indexOf(strCPF) !== -1
  )
    return false;

  for (let i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;

  for (let i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;

  if (Resto != parseInt(strCPF.substring(10, 11))) return false;

  return true;
}

export class CNPJ {
  cnpj: string | null;
  constructor(cnpj: string) {
    this.cnpj = cnpj;
  }
  validarCNPJ(cnpj: string, final: boolean = false): IValidacao {
    if (cnpj.length == 0 && !final) {
      return {
        valid: true,
        message: "",
      };
    }
    if (cnpj.length == 0 && final) {
      return {
        valid: false,
        message: "CNPJ é obrigatório",
      };
    }
    if (!validateCNPJ(cnpj)) {
      return {
        valid: false,
        message: "CNPJ inválido",
      };
    }
    return { valid: true, message: "" };
  }
}

function validateCNPJ(cnpj: string) {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D+/g, "");

  // Verifica se o CNPJ tem 14 dígitos
  if (cnpj.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  // Lista de pesos para os cálculos dos dígitos verificadores
  const pesosPrimeiroDigito = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesosSegundoDigito = [6].concat(pesosPrimeiroDigito);

  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj.charAt(i)) * pesosPrimeiroDigito[i];
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;

  // Verifica se o primeiro dígito está correto
  if (parseInt(cnpj.charAt(12)) !== digito1) return false;

  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj.charAt(i)) * pesosSegundoDigito[i];
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;

  // Verifica se o segundo dígito está correto
  if (parseInt(cnpj.charAt(13)) !== digito2) return false;

  return true;
}

export class Telefone {
  telefone: string;
  constructor(telefone: string) {
    this.telefone = telefone;
  }
  getTelefone(): string {
    return this.telefone;
  }
  validarTelefone(telefone: string, final: boolean = false): IValidacao {
    if (telefone.length == 0 && !final) {
      return {
        valid: true,
        message: "",
      };
    }
    if (telefone.length == 0 && final) {
      return {
        valid: false,
        message: "Telefone é obrigatório",
      };
    }
    if (telefone.length < 10) {
      return {
        valid: false,
        message: "Telefone deve ter no mínimo 10 caracteres",
      };
    }
    return {
      valid: true,
      message: "",
    };
  }
}

export type UserType = "master" | "colaborador" | "beergam_master";

export interface IBaseUsuario {
  nome: string;
  senha: string;
  user_type: UserType;
  conta_ml?: IContaML;
}

export interface IUsuario extends IBaseUsuario {
  email: string;
  cpf: string | null;
  cnpj: string | null;
  whatsapp: string;
  referred_code: string;
  referal_code: string;
  faturamento: FaixaFaturamentoKeys;
  conheceu_beergam: ComoConheceuKeys;
  allowed_views: AllowedViews;
}

interface IContaML {
  nome: string;
  image: string;
}

class ContaML implements IContaML {
  nome: string;
  image: string;
  constructor(conta: IContaML) {
    this.nome = conta.nome;
    this.image = conta.image;
  }
}

class Usuario implements IUsuario {
  nome: string;
  senha: string;
  user_type: "master";
  email: string;
  cpf: string | null;
  cnpj: string | null;
  whatsapp: string;
  referred_code: string;
  referal_code: string;
  faturamento: FaixaFaturamentoKeys;
  conheceu_beergam: ComoConheceuKeys;
  allowed_views: AllowedViews;
  conta_ml?: ContaML;
  constructor(usuario: IUsuario) {
    this.nome = usuario.nome;
    this.senha = usuario.senha;
    this.user_type = "master";
    this.email = usuario.email;
    this.cpf = usuario.cpf;
    this.cnpj = usuario.cnpj;
    this.whatsapp = usuario.whatsapp;
    this.referred_code = usuario.referred_code;
    this.referal_code = usuario.referal_code;
    this.faturamento = usuario.faturamento;
    this.conheceu_beergam = usuario.conheceu_beergam;
    this.allowed_views = usuario.allowed_views;
    this.conta_ml = new ContaML(usuario.conta_ml ?? { nome: "", image: "" });
  }
  validarUsuario(
    usuario: IUsuario,
    final: boolean = false,
    documento: "cpf" | "cnpj" = "cpf"
  ): IValidacao {
    const erros: string[] = [];
    const nome = this.validarNome(usuario.nome, final);
    const camposComErro = [];
    if (!nome.valid) {
      erros.push(nome.message as string);
      camposComErro.push("nome");
    }
    const email = this.validarEmail(usuario.email, final);
    if (!email.valid) {
      erros.push(email.message as string);
      camposComErro.push("email");
    }
    const senha = this.validarSenha(usuario.senha, final);
    if (!senha.valid) {
      erros.push(senha.message as string);
      camposComErro.push("senha");
    }
    const whatsapp = new Telefone(usuario.whatsapp).validarTelefone(
      usuario.whatsapp,
      final
    );
    if (!whatsapp.valid) {
      erros.push(whatsapp.message as string);
      camposComErro.push("whatsapp");
    }
    const cpf = new CPF(usuario.cpf ?? "").validarCPF(usuario.cpf ?? "", final);
    if (!cpf.valid && documento === "cpf") {
      erros.push(cpf.message as string);
      camposComErro.push("cpf");
    }
    const cnpj = new CNPJ(usuario.cnpj ?? "").validarCNPJ(
      usuario.cnpj ?? "",
      final
    );
    if (!cnpj.valid && documento === "cnpj") {
      erros.push(cnpj.message as string);
      camposComErro.push("cnpj");
    }
    return {
      valid: erros.length === 0,
      message: erros.length === 0 ? "" : erros,
      camposComErro: camposComErro,
    };
  }
  validarNome(nome: string, final: boolean = false): IValidacao {
    if (nome.length == 0 && !final) {
      return {
        valid: true,
        message: "",
      };
    }
    if (nome.length == 0 && final) {
      return {
        valid: false,
        message: "Nome é obrigatório",
      };
    }
    if (nome.length < 3) {
      return {
        valid: false,
        message: "Nome deve ter no mínimo 3 caracteres",
      };
    }
    if (nome.length > 20) {
      return {
        valid: false,
        message: "Nome deve ter no máximo 20 caracteres",
      };
    }
    return {
      valid: true,
      message: "",
    };
  }
  validarEmail(email: string, final: boolean = false): IValidacao {
    if (email.length > 0 && !final) {
      return {
        valid: true,
        message: "",
      };
    }
    if (email.length == 0 && final) {
      return {
        valid: false,
        message: "Email é obrigatório",
      };
    }
    if (!email.includes("@")) {
      return {
        valid: false,
        message: "Email inválido",
      };
    }
    if (email.length < 3) {
      return {
        valid: false,
        message: "Email deve ter no mínimo 3 caracteres",
      };
    }
    if (email.length > 50) {
      return {
        valid: false,
        message: "Email deve ter no máximo 50 caracteres",
      };
    }
    return {
      valid: true,
      message: "",
    };
  }
  validarSenha(senha: string, final: boolean = false): IValidacao {
    if (senha.length > 0 && !final) {
      return {
        valid: true,
        message: "",
      };
    }

    if (!senha) {
      return {
        valid: false,
        message: "A senha não pode estar vazia.",
      };
    }

    if (senha.length < 8) {
      return {
        valid: false,
        message: "A senha deve ter pelo menos 8 caracteres.",
      };
    }

    if (!/[A-Z]/.test(senha)) {
      return {
        valid: false,
        message: "A senha deve conter pelo menos uma letra maiúscula.",
      };
    }

    if (!/[a-z]/.test(senha)) {
      return {
        valid: false,
        message: "A senha deve conter pelo menos uma letra minúscula.",
      };
    }

    if (!/\d/.test(senha)) {
      return {
        valid: false,
        message: "A senha deve conter pelo menos um número.",
      };
    }

    if (!/[!@#$%^&*]/.test(senha)) {
      return {
        valid: false,
        message: "A senha deve conter pelo menos um caractere especial",
      };
    }

    return {
      valid: true,
      message: "Senha válida",
    };
  }
}
export default Usuario;

const ContaMlTeste = new ContaML({
  nome: "Conta ML Teste",
  image: "https://mla-s2-p.mlstatic.com/869034-MLA80043982303_102024-O.jpg",
});

export const UsuarioTeste = new Usuario({
  nome: "Jorge",
  cnpj: "12345678901234",
  cpf: "12345678901",
  email: "jorge@gmail.com",
  whatsapp: "12345678901",
  referred_code: "12345678901",
  referal_code: "12345678901",
  faturamento: "ATE_10_MIL",
  conheceu_beergam: "ANUNCIO_FACEBOOK",
  allowed_views: {
    ...getDefaultViews(),
  },
  senha: "1234567890",
  user_type: "master",
  conta_ml: ContaMlTeste,
});
