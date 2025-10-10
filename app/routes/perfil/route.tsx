import { toast } from "react-hot-toast";
import type { ApiResponse } from "~/features/apiClient/typings";
import { userService } from "~/features/user/service";
import type { IUser } from "~/features/user/typings/User";
import { UserSchema } from "~/features/user/typings/User";
import type { Route } from "./+types/route";
import PerfilPage from "./page";
import type { SubmitAction } from "./typings";
type PossibleDataTypes = IUser;
export async function clientAction({ request }: Route.ClientActionArgs) {
  const requestData = await request.json();
  console.log("requestData", requestData);
  let responsePromise: undefined | Promise<ApiResponse<PossibleDataTypes>> =
    undefined;
  switch (requestData.action as SubmitAction) {
    case "Minha Conta": {
      responsePromise = userService
        .editUserInformation(requestData.data)
        .then((response) => {
          if (!response.success) {
            const errorObj = new Error(
              response.message || "Erro ao editar informações do usuário"
            );
            Object.assign(errorObj, { ...response });
            throw errorObj;
          }
          return response;
        });
      break;
    }
  }

  if (responsePromise) {
    toast.promise(responsePromise, {
      loading: "Carregando...",
      success: "Informações do usuário editadas com sucesso",
      error: (err) => (
        <p>{err.message || "Erro ao editar informações do usuário"}</p>
      ),
    });
  }

  try {
    const response = await responsePromise;
    switch (requestData.action as SubmitAction) {
      case "Minha Conta": {
        const user = UserSchema.safeParse(response?.data);
        if (!user.success) {
          return Response.json({
            success: false,
            message: "Erro ao transformar informações do usuário",
            error_code: 500,
            error_fields: {},
            data: {} as PossibleDataTypes,
          });
        }
      }
    }
    return response;
  } catch (error) {
    console.error("Erro no perfil:", error);
    return Response.json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao editar informações do usuário",
      error_code: 500,
      error_fields: {},
      data: {} as PossibleDataTypes,
    });
  }
}

export default function PerfilRoute() {
  return <PerfilPage />;
}
