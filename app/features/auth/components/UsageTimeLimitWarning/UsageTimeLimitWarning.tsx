import { Link } from "react-router";
import PageLayout from "../PageLayout/PageLayout";

interface UsageTimeLimitWarningProps {
  message?: string;
  nextAllowedAt?: number | null;
  weekday?: string | null;
}

function formatNextAllowed(nextAllowedAt?: number | null) {
  if (!nextAllowedAt) {
    return null;
  }
  const date = new Date(nextAllowedAt * 1000);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatWeekday(weekday?: string | null) {
  if (!weekday) {
    return "";
  }
  try {
    // Mapeia o nome do dia em inglês para português
    const weekdayMap: Record<string, string> = {
      monday: "segunda-feira",
      tuesday: "terça-feira",
      wednesday: "quarta-feira",
      thursday: "quinta-feira",
      friday: "sexta-feira",
      saturday: "sábado",
      sunday: "domingo",
    };
    const normalized = weekday.toLowerCase();
    return weekdayMap[normalized] || weekday;
  } catch {
    return weekday;
  }
}

export default function UsageTimeLimitWarning({
  message,
  nextAllowedAt,
  weekday,
}: UsageTimeLimitWarningProps) {
  const nextSlot = formatNextAllowed(nextAllowedAt);
  const weekdayFormatted = formatWeekday(weekday);

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
            {message ?? "Tempo máximo diário excedido"}
          </p>
          {nextSlot && (
            <p className="text-center text-sm text-beergam-gray-light">
              Liberado novamente às {nextSlot}.
            </p>
          )}
          {weekdayFormatted && (
            <p className="text-center text-sm text-beergam-gray-light">
              Janela de acesso ativa apenas na(o) {weekdayFormatted}.
            </p>
          )}
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

