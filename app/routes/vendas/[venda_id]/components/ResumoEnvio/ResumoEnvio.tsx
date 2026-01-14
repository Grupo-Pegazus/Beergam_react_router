import LabelText from "../LabelText/LabelText";

interface ResumoEnvioProps {
  status: string;
  statusLabel: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

function ResumoEnvio({
  statusLabel,
  estimatedDelivery,
  trackingNumber,
}: ResumoEnvioProps) {
  return (
    <div className="bg-beergam-section-background! rounded-[15px] p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="mb-4">
        <h3 className="text-lg text-beergam-typography-primary! m-0 font-semibold">
          {statusLabel}
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-base text-beergam-typography-primary! font-medium m-0">
          Estimativa de entrega: {estimatedDelivery}
        </p>
        <div className="pt-3 border-t border-beergam-section-border!">
          <LabelText
            label="Código de rastreamento"
            text={trackingNumber}
            styleLabel={{
              color: "var(--color-beergam-typography-secondary)!",
              fontSize: "0.9rem",
            }}
            styleValue={{
              color: "var(--color-beergam-typography-primary)!",
              fontWeight: "600",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ResumoEnvio;
