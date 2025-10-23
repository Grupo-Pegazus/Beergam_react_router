import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useActionData } from "react-router";
import type { ApiResponse } from "~/features/apiClient/typings";
import { updateUserInfo } from "~/features/auth/redux";
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
        <>
          <p>{err.message || "Erro ao editar informações do usuário"}</p>
          {err.error_fields && Object.keys(err.error_fields).length > 0 && (
            <ul className="list-disc">
              {Object.keys(err.error_fields).map((field) => (
                <li className="font-bold" key={field}>
                  <p>{err?.error_fields?.[field]?.join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
        </>
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
  const dispatch = useDispatch();
  const actionData = useActionData<ApiResponse<PossibleDataTypes>>();
  const userValidation = UserSchema.safeParse(actionData?.data);
  useEffect(() => {
    if (actionData?.success && actionData.data && userValidation.success) {
      dispatch(updateUserInfo(userValidation.data));
    }
  }, [actionData, dispatch]);

  return <PerfilPage />;
}
