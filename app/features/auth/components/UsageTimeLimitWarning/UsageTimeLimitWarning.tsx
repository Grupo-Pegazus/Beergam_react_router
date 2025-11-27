import { Link } from "react-router";
import PageLayout from "../PageLayout/PageLayout";

export default function UsageTimeLimitWarning() {

  return (
    <PageLayout tailwindClassName="flex items-center justify-center">
      <div
        className={`flex shadow-lg/55 relative z-10 flex-col justify-center items-center gap-4 bg-beergam-white w-full mx-auto my-auto p-8 sm:w-2/3 sm:max-w-lg sm:rounded-4xl`}
      >
        <div className="flex justify-center">
          <div className="relative">
            {/* Ícone de relógio */}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-center text-2xl font-bold text-beergam-blue-primary">
          Tempo de Trabalho Excedido
        </h1>

        {/* Mensagem */}
        <div className="space-y-2">
          <p className="text-center text-base leading-relaxed text-beergam-gray">
            Tempo máximo diário excedido
          </p>
          <p className="text-center text-sm text-beergam-gray-light">
            Para continuar, faça login novamente.
          </p>
        </div>

        {/* Botão de ação */}
        <Link
          to="/"
          className="rounded-xl w-fit bg-beergam-orange px-6 py-4 text-base font-semibold text-beergam-white hover:bg-beergam-orange-dark"
        >
          Volte para a página inicial
        </Link>

        {/* Informação adicional */}
        <p className="text-center text-xs leading-relaxed text-beergam-gray-light">
          Se você precisa de mais tempo de acesso, entre em contato com o seu
          administrador.
        </p>
      </div>
    </PageLayout>
  );
}

