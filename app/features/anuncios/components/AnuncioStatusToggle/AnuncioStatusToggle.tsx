import { Chip, Switch, Typography } from "@mui/material";

interface AnuncioStatusToggleProps {
  status: string;
  subStatus: string[];
  isActive: boolean;
  isMutating: boolean;
  onToggle: () => void;
  showStatusMessage?: boolean;
  showControl?: boolean;
}

/**
 * Componente reutilizável para controle de status de anúncio
 * Exibe chips de status, switch de toggle e mensagens de substatus
 */
export default function AnuncioStatusToggle({
  status,
  subStatus,
  isActive,
  isMutating,
  onToggle,
  showStatusMessage = true,
  showControl = true,
}: AnuncioStatusToggleProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_");
  const isClosed = normalizedStatus === "closed";
  const isUnderReview = normalizedStatus === "under_review";
  // Se showControl é false, sempre mostra a mensagem se houver
  const statusMessage = (!showControl || showStatusMessage) ? getStatusMessage(status, subStatus) : null;

  // Se apenas a mensagem deve ser mostrada (para layout customizado)
  if (!showControl) {
    if (statusMessage) {
      return (
        <Typography
          variant="caption"
          color="text.secondary"
          className="block text-xs"
          sx={{ lineHeight: 1.4 }}
        >
          {statusMessage}
        </Typography>
      );
    }
    return null;
  }

  // Renderiza o controle (chip ou switch)
  const renderControl = () => {
    if (isClosed) {
      return (
        <Chip
          label="Fechado"
          size="small"
          sx={{
            height: 24,
            fontSize: "0.7rem",
            fontWeight: 600,
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      );
    }

    if (isUnderReview) {
      return (
        <Chip
          label="Em revisão"
          size="small"
          sx={{
            height: 24,
            fontSize: "0.7rem",
            fontWeight: 600,
            backgroundColor: "#fef3c7",
            color: "#92400e",
            "& .MuiChip-label": {
              px: 1.5,
            },
          }}
        />
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Typography
          variant="caption"
          color={isActive ? "text.secondary" : "text.disabled"}
          sx={{ fontSize: "0.7rem" }}
        >
          Pausado
        </Typography>
        <div className="relative">
          <Switch
            checked={isActive}
            onChange={onToggle}
            disabled={isMutating || isUnderReview}
            sx={{
              "& .MuiSwitch-thumb": {
                boxShadow: "0px 1px 2px rgba(15, 23, 42, 0.25)",
              },
            }}
          />
          {isMutating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>
        <Typography
          variant="caption"
          color={isActive ? "text.primary" : "text.disabled"}
          sx={{ fontSize: "0.7rem", fontWeight: 600 }}
        >
          Ativo
        </Typography>
      </div>
    );
  };

  // Se apenas a mensagem deve ser mostrada
  if (!showControl) {
    if (statusMessage) {
      return (
        <Typography
          variant="caption"
          color="text.secondary"
          className="block text-xs"
          sx={{ lineHeight: 1.4 }}
        >
          {statusMessage}
        </Typography>
      );
    }
    return null;
  }

  // Se apenas o controle deve ser mostrado (sem mensagem)
  if (!showStatusMessage) {
    return <div className="flex items-center gap-2">{renderControl()}</div>;
  }

  // Mostra controle e mensagem juntos
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">{renderControl()}</div>
      {statusMessage && (
        <Typography
          variant="caption"
          color="text.secondary"
          className="block text-xs"
          sx={{ lineHeight: 1.4 }}
        >
          {statusMessage}
        </Typography>
      )}
    </div>
  );
}

/**
 * Função utilitária para obter mensagem de status baseada no status e substatus
 * Seguindo Single Responsibility Principle
 */
function getStatusMessage(status: string, subStatus: string[]): string | null {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_");
  const normalizedSubStatus = subStatus.map((s) => s.toLowerCase());

  // Closed
  if (normalizedStatus === "closed") {
    if (normalizedSubStatus.includes("moderation_penalty")) {
      return "Item sem vendas.";
    }
    return null;
  }

  // Paused
  if (normalizedStatus === "paused") {
    if (normalizedSubStatus.includes("picture_downloading_pending")) {
      return "Pausado por carregamento de imagem por URL.";
    }
    if (normalizedSubStatus.includes("moderation_penalty")) {
      return "Alteração incomum de preços + item sem vendas.";
    }
    if (normalizedSubStatus.includes("out_of_stock")) {
      return "Item sem estoque.";
    }
    return null;
  }

  // Under review
  if (normalizedStatus === "under_review") {
    if (normalizedSubStatus.includes("waiting_for_patch")) {
      return "Item pausado porque foram detectadas infrações e o usuário deve modificá-lo para que fique ativo.";
    }
    if (normalizedSubStatus.includes("forbidden")) {
      return "Item desativado pelo Mercado Livre. Substitui o status Inactive.";
    }
    if (normalizedSubStatus.includes("held")) {
      return "Inativo. Em revisão pelo Mercado Livre.";
    }
    if (normalizedSubStatus.includes("pending_documentation")) {
      return "Item com denúncia no Programa de Proteção de Marca.";
    }
    if (
      normalizedSubStatus.includes("suspended") ||
      normalizedSubStatus.includes("suspended_for_prevention")
    ) {
      return "Suspensão de itens com risco de operações fraudulentas.";
    }
    return null;
  }

  // Active
  if (normalizedStatus === "active") {
    if (normalizedSubStatus.includes("poor_quality_thumbnail")) {
      return "Imagem de baixa qualidade.";
    }
    if (normalizedSubStatus.includes("moderation_penalty")) {
      return "Item com alguma penalidade. Você pode modificar status, blur ou outros.";
    }
    return null;
  }

  return null;
}

