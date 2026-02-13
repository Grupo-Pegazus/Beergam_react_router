import { useLogoutFlow } from "~/features/auth/hooks/useLogoutFlow";
import PageLayout from "../PageLayout/PageLayout";
export default function MultipleDeviceWarning() {
  const { isLoggingOut, logout } = useLogoutFlow({
    redirectTo: "/login",
  });
  return (
    <PageLayout tailwindClassName="flex items-center justify-center px-4">
      <div
        className={`flex shadow-lg/55 relative z-10 flex-col justify-center items-center gap-3 sm:gap-4 bg-beergam-section-background! w-full mx-auto my-auto p-4 sm:p-6 md:p-8 sm:w-2/3 sm:max-w-2xl sm:rounded-4xl`}
      >
        <div className="flex justify-center">
          <div className="relative">
            {/* Dispositivo principal */}
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-beergam-orange-light">
              <svg
                className="h-10 w-10 sm:h-12 sm:w-12 text-beergam-orange"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            {/* Dispositivo secundário com X */}
            <div className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex size-6 sm:size-8 items-center justify-center rounded-xl bg-beergam-red-light">
              <svg
                className="size-4 sm:size-6 text-beergam-red-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-center text-xl sm:text-2xl font-bold text-beergam-typography-primary!">
          Sessão Encerrada
        </h1>

        {/* Mensagem */}
        <div className="space-y-2">
          <p className="text-center text-sm sm:text-base md:text-lg leading-relaxed text-beergam-gray">
            Sua conta foi acessada em outro dispositivo. Por segurança, sua
            sessão atual foi encerrada.
          </p>
          <p className="text-center text-sm sm:text-base md:text-lg leading-relaxed text-beergam-gray">
            Se você for um colaborador, suas informações podem ter sido
            alteradas pelo empregador responsável.
          </p>
          <p className="text-center text-sm sm:text-base text-beergam-gray-light">
            Para continuar, faça login novamente.
          </p>
        </div>

        {/* Botão de ação */}
        <button
          onClick={(e) => {
            e.preventDefault();
            void logout();
          }}
          className="rounded-xl w-full sm:w-fit min-w-[200px] bg-beergam-orange px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold text-beergam-white hover:bg-beergam-orange-dark disabled:opacity-60"
          aria-disabled={isLoggingOut}
        >
          Fazer Login Novamente
        </button>

        {/* Informação adicional */}
        <p className="text-center text-xs leading-relaxed text-beergam-gray-light px-1">
          Se você não reconhece este acesso, entre em contato com o suporte.
        </p>
      </div>
    </PageLayout>
  );
}
