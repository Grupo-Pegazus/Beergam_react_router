import type { ImportPhase } from "../../typings";

interface PhaseIndicatorProps {
  phases: ImportPhase[];
  compact?: boolean;
}

export default function PhaseIndicator({
  phases,
  compact = false,
}: PhaseIndicatorProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {phases.map((phase) => (
          <div
            key={phase.name}
            className={`rounded-full transition-all duration-500 ${
              phase.status === "completed"
                ? "w-2 h-2 bg-beergam-green-primary"
                : phase.status === "in_progress"
                  ? "w-2.5 h-2.5 bg-beergam-orange animate-pulse"
                  : "w-1.5 h-1.5 bg-white/30"
            }`}
            title={`${phase.label}: ${phase.status}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {phases.map((phase) => (
        <div key={phase.name} className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full shrink-0 transition-all duration-500 ${
              phase.status === "completed"
                ? "bg-beergam-green-primary"
                : phase.status === "in_progress"
                  ? "bg-beergam-orange animate-pulse ring-2 ring-beergam-orange/30"
                  : "bg-beergam-gray/40"
            }`}
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span
              className={`text-xs font-medium truncate ${
                phase.status === "completed"
                  ? "text-beergam-green-primary"
                  : phase.status === "in_progress"
                    ? "text-beergam-orange"
                    : "text-beergam-typography-secondary"
              }`}
            >
              {phase.label}
            </span>
            {phase.detail && phase.status === "in_progress" && (
              <span className="text-[10px] text-beergam-typography-secondary truncate">
                {phase.detail}
              </span>
            )}
          </div>
          {phase.status === "completed" && (
            <svg
              className="w-3.5 h-3.5 text-beergam-green-primary shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
