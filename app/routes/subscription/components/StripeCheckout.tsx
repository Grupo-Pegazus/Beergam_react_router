import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAuthInfo } from "~/features/auth/redux";
import { subscriptionService } from "~/features/plans/subscriptionService";
import type { Plan, Subscription } from "~/features/user/typings/BaseUser";
import { SubscriptionSchema } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";

interface StripeCheckoutProps {
  plan: Plan;
  onSuccess?: (subscription: Subscription) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

/**
 * Inicializa o Stripe com a chave pública
 *
 * IMPORTANTE: Configure VITE_STRIPE_PUBLISHABLE_KEY nas variáveis de ambiente
 *
 * Exemplo no arquivo .env:
 * VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
 */
const getStripePromise = (): Promise<Stripe | null> => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error(
      "⚠️ VITE_STRIPE_PUBLISHABLE_KEY não configurada. " +
        "Configure esta variável no arquivo .env"
    );
  }

  return loadStripe(publishableKey || "");
};

const stripePromise = getStripePromise();

/**
 * Componente que exibe o checkout embutido do Stripe para assinaturas
 *
 */
export default function StripeCheckout({
  plan,
  onSuccess,
  onError,
  onCancel,
}: StripeCheckoutProps) {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  /**
   * Função que busca o client secret do backend
   *
   * Esta função é chamada pelo EmbeddedCheckoutProvider automaticamente.
   * Ela deve retornar uma Promise que resolve com o client_secret.
   */
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    try {
      setError(null);
      setIsInitializing(true);

      // Verifica se o plano tem price_id
      const priceId = plan.price_id;
      if (!priceId) {
        throw new Error("Plano não possui price_id configurado");
      }

      const returnUrl = `${window.location.origin}/interno/perfil?subscription=success`;

      const response = await subscriptionService.createSubscriptionCheckout({
        price_id: priceId,
        return_url: returnUrl,
      });

      if (!response.success || !response.data.clientSecret) {
        throw new Error(response.message || "Erro ao criar sessão de checkout");
      }
      const subscriptionResponse = await subscriptionService.getSubscription();
      dispatch(
        updateAuthInfo({
          auth: {
            subscription: subscriptionResponse.data,
            loading: false,
            error: null,
            success: true,
          },
          shouldEncrypt: true,
        })
      );
      return response.data.clientSecret;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao inicializar checkout. Tente novamente.";
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [plan.price_id, onError]);

  /**
   * Trata o evento de sucesso do checkout
   *
   * Este callback é chamado quando o pagamento é concluído com sucesso no embedded checkout.
   * Para métodos de pagamento que fazem redirect (ex: alguns bancos), o usuário será
   * redirecionado para a return_url com session_id, que será tratado na rota.
   */
  const handleCheckoutComplete = useCallback(async () => {
    try {
      // Busca a subscription atualizada do backend
      const response = await subscriptionService.getSubscription();

      if (response.success && response.data) {
        // Valida e atualiza o Redux com a nova assinatura
        const validatedSubscription = SubscriptionSchema.safeParse(
          response.data
        );

        if (validatedSubscription.success) {
          onSuccess?.(validatedSubscription.data);
        } else {
          console.error(
            "Erro ao validar subscription:",
            validatedSubscription.error
          );
          throw new Error("Erro ao validar dados da assinatura");
        }
      } else {
        throw new Error(
          response.message || "Erro ao buscar assinatura atualizada"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao atualizar assinatura após pagamento";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [dispatch, onSuccess, onError]);

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="relative rounded-none border-0 bg-transparent shadow-none">
          <div className="px-2 sm:px-8 pt-4 pb-3 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/30">
              <Svg.circle_x
                width={28}
                height={28}
                tailWindClasses="text-red-400"
              />
            </div>
            <h2 className="text-2xl font-bold text-beergam-blue-primary">
              Algo deu errado
            </h2>
            <p className="mt-2 text-beergam-gray text-base">{error}</p>
          </div>
          <div className="px-2 sm:px-8 pb-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setError(null);
              }}
              className="rounded-2xl bg-beergam-blue-primary px-6 py-3 font-medium text-beergam-white transition-colors hover:bg-beergam-orange"
            >
              Tentar novamente
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="rounded-2xl border-2 border-beergam-blue-light bg-beergam-white px-6 py-3 font-medium text-beergam-blue-primary transition-colors hover:bg-beergam-blue-light/20"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="relative rounded-none border-0 bg-transparent shadow-none">
        {/* Cabeçalho */}
        <div className="px-2 sm:px-8 pt-4 pb-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-beergam-blue-primary">
              <Svg.card
                width={24}
                height={24}
                tailWindClasses="text-beergam-white"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-beergam-blue-primary">
                Finalizar assinatura
              </h2>
              <p className="text-sm text-beergam-gray">
                Pagamento processado com segurança pela Stripe
              </p>
            </div>
          </div>
          {plan?.display_name && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-beergam-blue bg-beergam-blue-light/30 px-3 py-1 text-sm text-beergam-blue-primary">
              <span className="opacity-80">Plano selecionado:</span>
              <span className="font-semibold">{plan.display_name}</span>
            </div>
          )}
        </div>

        {/* Benefícios rápidos */}
        <div className="px-2 sm:px-8 pb-3">
          <ul className="flex flex-wrap gap-3 text-sm text-beergam-gray">
            <li className="inline-flex items-center gap-2 rounded-full bg-beergam-blue-light/80 px-3 py-1 ring-1 ring-beergam-blue-light">
              <Svg.check
                width={16}
                height={16}
                tailWindClasses="text-beergam-green"
              />
              Sem taxas ocultas
            </li>
            <li className="inline-flex items-center gap-2 rounded-full bg-beergam-blue-light/80 px-3 py-1 ring-1 ring-beergam-blue-light">
              <Svg.lock_closed
                width={16}
                height={16}
                tailWindClasses="text-beergam-blue-primary"
              />
              Ambiente seguro
            </li>
            <li className="inline-flex items-center gap-2 rounded-full bg-beergam-blue-light/80 px-3 py-1 ring-1 ring-beergam-blue-light">
              <Svg.clock
                width={16}
                height={16}
                tailWindClasses="text-beergam-orange"
              />
              Ativação imediata
            </li>
          </ul>
        </div>

        {/* Área do checkout */}
        <div className="relative px-2 sm:px-8 pb-6">
          <div className="rounded-2xl border-2 border-beergam-blue-light bg-beergam-white p-2 sm:p-4">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                fetchClientSecret,
                onComplete: handleCheckoutComplete,
              }}
            >
              <div className="relative">
                {isInitializing && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-beergam-blue-light/20 backdrop-blur-sm">
                    <div className="inline-flex items-center gap-3 rounded-full border border-beergam-blue-light bg-beergam-white px-4 py-2 text-beergam-blue-primary">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-beergam-blue-light border-t-beergam-blue-primary" />
                      Preparando checkout…
                    </div>
                  </div>
                )}
                <EmbeddedCheckout />
              </div>
            </EmbeddedCheckoutProvider>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-2 sm:px-8 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 text-sm text-beergam-gray">
            <Svg.lock_closed
              width={16}
              height={16}
              tailWindClasses="text-beergam-blue-primary"
            />
            Transações protegidas e criptografadas
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-beergam-gray">
            <span className="opacity-75">Powered by</span>
            <span className="font-semibold text-beergam-blue-primary">
              Stripe
            </span>
          </div>
        </div>

        {/* Ações */}
        {onCancel && (
          <div className="px-2 sm:px-8 pb-4 pt-0">
            <button
              onClick={onCancel}
              className="w-full rounded-2xl border-2 border-beergam-blue-light bg-beergam-white px-6 py-3 font-medium text-beergam-blue-primary transition-colors hover:bg-beergam-blue-light/20"
            >
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
