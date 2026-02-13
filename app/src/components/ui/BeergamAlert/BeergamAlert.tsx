import type { ReactNode } from "react";
import Svg from "~/src/assets/svgs/_index";

type BeergamAlertSeverity = "error" | "warning" | "info" | "success";

interface BeergamAlertProps {
  severity: BeergamAlertSeverity;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

const severityConfig = {
  error: {
    bg: "var(--color-beergam-alert-error-bg)",
    border: "var(--color-beergam-alert-error-border)",
    text: "var(--color-beergam-alert-error-text)",
    icon: "var(--color-beergam-alert-error-icon)",
    SvgIcon: Svg.x_circle,
  },
  warning: {
    bg: "var(--color-beergam-alert-warning-bg)",
    border: "var(--color-beergam-alert-warning-border)",
    text: "var(--color-beergam-alert-warning-text)",
    icon: "var(--color-beergam-alert-warning-icon)",
    SvgIcon: Svg.warning_circle,
  },
  info: {
    bg: "var(--color-beergam-alert-info-bg)",
    border: "var(--color-beergam-alert-info-border)",
    text: "var(--color-beergam-alert-info-text)",
    icon: "var(--color-beergam-alert-info-icon)",
    SvgIcon: Svg.information_circle,
  },
  success: {
    bg: "var(--color-beergam-alert-success-bg)",
    border: "var(--color-beergam-alert-success-border)",
    text: "var(--color-beergam-alert-success-text)",
    icon: "var(--color-beergam-alert-success-icon)",
    SvgIcon: Svg.check_circle,
  },
} as const;

export default function BeergamAlert({
  severity,
  children,
  action,
  className = "",
}: BeergamAlertProps) {
  const config = severityConfig[severity];
  const IconComponent = config.SvgIcon;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border p-4 ${className}`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
      }}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="shrink-0 mt-0.5 flex" style={{ color: config.icon }}>
          <IconComponent
            width={20}
            height={20}
            tailWindClasses="shrink-0"
          />
        </span>
        <div
          className="text-sm leading-relaxed"
          style={{ color: config.text }}
        >
          {children}
        </div>
      </div>
      {action && (
        <div className="flex w-full justify-start sm:w-auto sm:justify-end shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
