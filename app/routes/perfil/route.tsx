import { useEffect } from "react";
import toast from "~/src/utils/toast";
import { useActionData, useSearchParams } from "react-router";
import type { ApiResponse } from "~/features/apiClient/typings";
import authStore from "~/features/store-zustand";
import { subscriptionService } from "~/features/plans/subscriptionService";
import { userService } from "~/features/user/service";
import { SubscriptionSchema } from "~/features/user/typings/BaseUser";
import type { IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import { UserSchema } from "~/features/user/typings/User";
import type { Route } from "./+types/route";
import PerfilPage from "./page";
import type { SubmitAction } from "./typings";
type PossibleDataTypes = IUser | IColab;
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
    console.log("responsePromise do toast.promise", responsePromise);
    toast.promise(responsePromise, {
      loading: "Carregando...",
      success: "Informações do usuário editadas com sucesso",
      error: (err) => (
        <>
          <p>
            {(err instanceof Error ? err.message : String(err)) ||
              "Erro ao editar informações do usuário"}
          </p>
        </>
      ),
    });
  }

  try {
    const response = await responsePromise;
    console.log("response do await responsePromise", response);
    return response;
  } catch (error) {
    return Response.json(error as ApiResponse<PossibleDataTypes>);
  }
}

export default function PerfilRoute() {
  const actionData = useActionData<ApiResponse<PossibleDataTypes>>();
  const [searchParams] = useSearchParams();
  const userValidation = UserSchema.safeParse(actionData?.data);

  /**
   * Atualiza o Zustand quando há dados de ação retornados
   */
  useEffect(() => {
    if (actionData?.success && actionData.data && userValidation.success) {
      authStore.getState().updateUserInfo(userValidation.data);
    }
  }, [actionData, userValidation]);

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
              authStore.getState().updateSubscription(validatedSubscription.data);
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
  }, [searchParams]);

  return <PerfilPage />;
}
