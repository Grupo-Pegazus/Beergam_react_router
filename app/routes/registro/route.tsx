import { toast } from "react-hot-toast";
import type { ApiResponse } from "~/features/apiClient/typings";
import { authService } from "~/features/auth/service";
import { UserRoles, UserStatus } from "~/features/user/typings/BaseUser";
import type { IColab } from "~/features/user/typings/Colab";
import type {
  ComoConheceu,
  IUser,
  ProfitRange,
} from "~/features/user/typings/User";
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
  const referral_code = formData.get("referral_code");
  const responsePromise = authService
    .register({
      colabs: {} as Record<string, IColab>,
      created_at: new Date(),
      updated_at: new Date(),
      name: name as string,
      password: password as string,
      role: UserRoles.MASTER,
      status: UserStatus.ACTIVE,
      details: {
        email: email as string,
        cpf: cpf as string,
        cnpj: cnpj as string,
        phone: telefone as string,
        found_beergam: found_beergam as string as ComoConheceu | null,
        profit_range: profit_range as string as ProfitRange,
        referral_code: referral_code as string | null,
      },
    })
    .then((response) => {
      if (!response.success) {
        const errorObj = new Error(response.message);
        Object.assign(errorObj, { ...response });
        throw errorObj;
      }
      return response;
    });
  toast.promise(responsePromise, {
    loading: "Carregando...",
    success: (msg: ApiResponse<IUser>) => {
      window.setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return <p>{msg.message}</p>;
    },
    error: (err: ApiResponse<IUser>) => (
      <div>
        <p className="text-nowrap">{`${err.message || ""}`}</p>
        {err.error_fields && Object.keys(err.error_fields).length > 0 && (
          <ul className="list-disc">
            {Object.keys(err.error_fields).map((field) => (
              <li className="font-bold" key={field}>
                <p>{err?.error_fields?.[field]?.join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
        <p>
          <u>Código: {err.error_code}</u>
        </p>
      </div>
    ),
  });
  let response = null;
  try {
    console.log("response do await responsePromise", response);
    response = await responsePromise;
    return response;
  } catch (error) {
    console.log("error do await responsePromise", error);
    response = error;
    return response;
  }
}

export default function RegistroRoute() {
  return <RegistroPage />;
}
