import type { ImportProgress } from "../../typings";
import PhaseIndicator from "./PhaseIndicator";

interface ImportProgressOverlayProps {
  progress: ImportProgress;
}

export default function ImportProgressOverlay({
  progress,
}: ImportProgressOverlayProps) {
  const { progress_pct, current_phase, eta_formatted, status, error_message } =
    progress;
  const isRetrying = status === "error" && error_message?.toLowerCase().includes("retry");
  const isCompleted = status === "completed";
  const isFatalError = status === "error" && !isRetrying;
  const percentage = Math.round(progress_pct);

  return (
    <div className="absolute inset-0 z-10 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
        {/* Circular progress */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={
                isFatalError
                  ? "var(--color-beergam-red)"
                  : isCompleted
                    ? "var(--color-beergam-green-primary)"
                    : "var(--color-beergam-orange)"
              }
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - percentage / 100)}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
            {percentage}%
          </span>
        </div>

        {/* Current phase */}
        <p className="text-white text-xs font-medium text-center leading-tight line-clamp-2">
          {isFatalError
            ? error_message ?? "Erro na importação"
            : isRetrying
              ? "Reconectando..."
              : current_phase ?? "Iniciando..."}
        </p>

        {/* ETA */}
        {!isCompleted && !isFatalError && eta_formatted && (
          <span className="text-white/70 text-[10px]">
            Restante: {eta_formatted}
          </span>
        )}

        {/* Retry indicator */}
        {isRetrying && (
          <div className="flex items-center gap-1.5">
            <div className="animate-spin rounded-full h-3 w-3 border border-beergam-orange border-t-transparent" />
            <span className="text-beergam-orange text-[10px] font-medium">
              Tentando novamente...
            </span>
          </div>
        )}

        {/* Mini phase dots */}
        {!isFatalError && progress.phases.length > 0 && (
          <PhaseIndicator phases={progress.phases} compact />
        )}
      </div>
    </div>
  );
}
