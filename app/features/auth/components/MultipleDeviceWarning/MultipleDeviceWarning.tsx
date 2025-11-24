import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { logout } from "../../redux";
import PageLayout from "../PageLayout/PageLayout";
export default function MultipleDeviceWarning() {
  const dispatch = useDispatch();
  return (
    <PageLayout tailwindClassName="flex items-center justify-center">
      <div
        className={`flex shadow-lg/55 relative z-10 flex-col justify-center items-center gap-4 bg-beergam-white w-[100%] mx-auto my-auto p-8 sm:w-2/3 sm:max-w-[32rem] sm:rounded-4xl`}
      >
        <div className="flex justify-center">
          <div className="relative">
            {/* Dispositivo principal */}
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-beergam-orange-light">
              <svg
                className="h-12 w-12 text-beergam-orange"
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
            <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-xl bg-beergam-red-light">
              <svg
                className="size-6 text-beergam-red-primary"
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
        <h1 className="text-center text-2xl font-bold text-beergam-blue-primary">
          Sessão Encerrada
        </h1>

        {/* Mensagem */}
        <div className="space-y-2">
          <p className="text-center text-base leading-relaxed text-beergam-gray">
            Sua conta foi acessada em outro dispositivo. Por segurança, sua
            sessão atual foi encerrada.
          </p>
          <p className="text-center text-sm text-beergam-gray-light">
            Para continuar, faça login novamente.
          </p>
        </div>

        {/* Botão de ação */}
        <Link
          to="/login"
          onClick={() => {
            dispatch(logout());
          }}
          className="rounded-xl w-fit bg-beergam-orange px-6 py-4 text-base font-semibold text-beergam-white hover:bg-beergam-orange-dark"
        >
          Fazer Login Novamente
        </Link>

        {/* Informação adicional */}
        <p className="text-center text-xs leading-relaxed text-beergam-gray-light">
          Se você não reconhece este acesso, entre em contato com o suporte.
        </p>
      </div>
    </PageLayout>
  );
}
