import { authService } from "~/features/auth/service";
import type {
  ComoConheceuKeys,
  Faixaprofit_rangeKeys,
} from "~/features/user/typings";
import { UsuarioRoles } from "~/features/user/typings";
import type { Route } from "./+types/route";
import RegistroPage from "./page";
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  const cpf = formData.get("cpf") || null;
  const cnpj = formData.get("cnpj") || null;
  const telefone = formData.get("whatsapp");
  const found_beergam = formData.get("found_beergam");
  const profit_range = formData.get("profit_range");
  const personal_reference_code = formData.get("personal_reference_code");
  const referal_code = formData.get("referal_code");
  authService.register({
    email: email as string,
    name: name as string,
    password: password as string,
    cpf: cpf as string,
    cnpj: cnpj as string,
    phone: telefone as string,
    found_beergam: found_beergam as string as ComoConheceuKeys | null,
    profit_range: profit_range as string as Faixaprofit_rangeKeys,
    personal_reference_code: personal_reference_code as string,
    referal_code: referal_code as string,
    role: UsuarioRoles.MASTER,
  });
}

export default function RegistroRoute() {
  return (
    <RegistroPage
    // actionResponse={{
    //   success: true,
    //   data: null,
    //   message: "",
    //   error_code: 0,
    //   error_fields: {},
    // }}
    />
  );
}
