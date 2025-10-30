import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useActionData, useSearchParams } from "react-router";
import type { ApiResponse } from "~/features/apiClient/typings";
import { updateUserInfo, updateUserSubscription } from "~/features/auth/redux";
import { subscriptionService } from "~/features/plans/subscriptionService";
import { userService } from "~/features/user/service";
import { SubscriptionSchema } from "~/features/user/typings/BaseUser";
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
      responsePromise = (async () => {
        const response = await userService.editUserInformation(
          requestData.data
        );
        if (!response.success) {
          const errorObj = new Error(
            response.message || "Erro ao editar informações do usuário"
          );
          Object.assign(errorObj, { ...response });
          throw errorObj;
        }
        return response as ApiResponse<PossibleDataTypes>;
      })();
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
    return Response.json(error as ApiResponse<PossibleDataTypes>);
  }
}

export default function PerfilRoute() {
  const dispatch = useDispatch();
  const actionData = useActionData<ApiResponse<PossibleDataTypes>>();
  const [searchParams] = useSearchParams();
  const userValidation = UserSchema.safeParse(actionData?.data);

  /**
   * Atualiza o Redux quando há dados de ação retornados
   */
  useEffect(() => {
    if (actionData?.success && actionData.data && userValidation.success) {
      dispatch(updateUserInfo(userValidation.data));
    }
  }, [actionData, dispatch, userValidation]);

  /**
   * Busca e atualiza apenas a subscription do usuário após checkout bem-sucedido
   * Usa a rota GET /v1/stripe/payments/subscription que retorna apenas a subscription
   */
  useEffect(() => {
    const subscriptionSuccess = searchParams.get("subscription");

    if (subscriptionSuccess === "success") {
      const fetchUpdatedSubscription = async () => {
        try {
          const response = await subscriptionService.getSubscription();

          if (response.success && response.data) {
            const validatedSubscription = SubscriptionSchema.safeParse(
              response.data
            );

            if (validatedSubscription.success) {
              dispatch(updateUserSubscription(validatedSubscription.data));
              toast.success(
                "Assinatura criada com sucesso! Suas informações foram atualizadas."
              );

              // Remove o parâmetro da URL para evitar requisições desnecessárias
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.delete("subscription");
              window.history.replaceState(
                {},
                "",
                `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`
              );
            } else {
              console.error(
                "Erro ao validar subscription:",
                validatedSubscription.error
              );
              toast.error(
                "Erro ao validar dados da assinatura. Tente atualizar a página."
              );
            }
          } else {
            console.error("Erro ao buscar subscription:", response.message);
            toast.error(
              response.message ||
                "Erro ao atualizar sua assinatura. Tente atualizar a página."
            );
          }
        } catch (error) {
          console.error("Erro ao buscar subscription atualizada:", error);
          toast.error(
            "Erro ao atualizar sua assinatura. Tente atualizar a página."
          );
        }
      };

      fetchUpdatedSubscription();
    }
  }, [searchParams, dispatch]);

  return <PerfilPage />;
}
