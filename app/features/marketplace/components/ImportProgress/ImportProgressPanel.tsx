import type { ImportProgress } from "../../typings";
import PhaseIndicator from "./PhaseIndicator";

interface ImportProgressPanelProps {
  progress: ImportProgress;
  accountName?: string;
}

export default function ImportProgressPanel({
  progress,
  accountName,
}: ImportProgressPanelProps) {
  const {
    progress_pct,
    current_phase,
    eta_formatted,
    status,
    elapsed_seconds,
    error_message,
  } = progress;
  const percentage = Math.round(progress_pct);
  const isCompleted = status === "completed";
  const isRetrying =
    status === "error" && error_message?.toLowerCase().includes("retry");
  const isFatalError = status === "error" && !isRetrying;
  const isWorking = status === "in_progress" || isRetrying;

  const elapsedFormatted = formatElapsed(elapsed_seconds);

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isFatalError
              ? "bg-beergam-red-light"
              : isCompleted
                ? "bg-beergam-green-light"
                : "bg-beergam-orange-light"
          }`}
        >
          {isFatalError ? (
            <svg
              className="w-6 h-6 text-beergam-red-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : isCompleted ? (
            <svg
              className="w-6 h-6 text-beergam-green-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-beergam-orange border-t-transparent" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-beergam-typography-primary">
            {isFatalError
              ? "Erro na importação"
              : isCompleted
                ? "Importação concluída!"
                : isRetrying
                  ? "Reconectando..."
                  : "Importando dados..."}
          </h4>
          {accountName && (
            <p className="text-xs text-beergam-typography-secondary truncate">
              {accountName}
            </p>
          )}
        </div>
        <span
          className={`text-2xl font-bold shrink-0 ${
            isFatalError
              ? "text-beergam-red-primary"
              : isCompleted
                ? "text-beergam-green-primary"
                : "text-beergam-orange"
          }`}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="w-full h-2.5 bg-beergam-section-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isFatalError
                ? "bg-beergam-red-primary"
                : isCompleted
                  ? "bg-beergam-green-primary"
                  : "bg-linear-to-r from-beergam-orange to-beergam-yellow"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-beergam-typography-secondary">
            {isFatalError
              ? error_message ?? "Ocorreu um erro durante a importação"
              : isRetrying
                ? "Reconectando ao servidor..."
                : current_phase ?? "Preparando..."}
          </p>
          <div className="flex items-center gap-3 text-[10px] text-beergam-typography-secondary shrink-0">
            {elapsedFormatted && <span>Decorrido: {elapsedFormatted}</span>}
            {isWorking && eta_formatted && (
              <span>Restante: {eta_formatted}</span>
            )}
          </div>
        </div>
      </div>

      {/* Retry banner */}
      {isRetrying && (
        <div className="p-3 md:p-4 bg-beergam-orange-light border border-beergam-orange/30 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-beergam-orange border-t-transparent shrink-0" />
            <p className="text-sm text-beergam-orange-dark font-medium">
              Houve uma instabilidade na conexão. O sistema está tentando
              novamente automaticamente...
            </p>
          </div>
        </div>
      )}

      {/* Phases list */}
      {progress.phases.length > 0 && (
        <div className="border border-beergam-section-border rounded-xl p-3 md:p-4">
          <p className="text-xs font-semibold text-beergam-typography-primary mb-3">
            Etapas da importação
          </p>
          <PhaseIndicator phases={progress.phases} />
        </div>
      )}

      {/* Completed message */}
      {isCompleted && (
        <div className="p-3 md:p-4 bg-beergam-green-light border border-beergam-green-primary/30 rounded-xl">
          <p className="text-sm text-beergam-green-dark font-medium">
            Seus dados foram importados com sucesso! Você já pode acessar o
            painel completo da sua loja.
          </p>
        </div>
      )}

      {/* Fatal error message */}
      {isFatalError && (
        <div className="p-3 md:p-4 bg-beergam-red-light border border-beergam-red/30 rounded-xl">
          <p className="text-sm text-beergam-red-dark font-medium">
            {error_message ??
              "Ocorreu um erro durante a importação. Por favor, tente novamente ou entre em contato com o suporte."}
          </p>
        </div>
      )}
    </div>
  );
}

function formatElapsed(seconds: number | null): string | null {
  if (!seconds || seconds <= 0) return null;
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (min < 60) return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
  const hrs = Math.floor(min / 60);
  const remainMin = min % 60;
  return remainMin > 0 ? `${hrs}h ${remainMin}m` : `${hrs}h`;
}
