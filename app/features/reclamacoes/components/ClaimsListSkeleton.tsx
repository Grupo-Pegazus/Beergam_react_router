import { Skeleton, Stack } from "@mui/material";

export default function ClaimsListSkeleton() {
  return (
    <Stack spacing={3}>
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="rounded-2xl p-4 shadow-sm flex flex-col gap-3 bg-beergam-section-background border border-beergam-section-border"
        >
          {/* Cabeçalho - layout mais compacto */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              {/* ID e status */}
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton variant="text" width={100} height={16} />
                <Skeleton variant="circular" width={8} height={8} />
                <Skeleton variant="rectangular" width={80} height={20} className="rounded-full" />
                <Skeleton variant="circular" width={8} height={8} />
                <Skeleton variant="text" width={120} height={14} />
              </div>
              {/* Reason da reclamação */}
              <Skeleton variant="text" width="95%" height={18} />
              <Skeleton variant="text" width="75%" height={18} />
            </div>
            {/* Botão responder - posicionamento diferente */}
            <Skeleton variant="rectangular" width={110} height={36} className="rounded-lg shrink-0" />
          </div>

          {/* Thread de mensagens (opcional) */}
          {index % 2 === 0 && (
            <div className="bg-beergam-primary/10 border border-beergam-primary/30 rounded-xl p-3 space-y-2">
              <Skeleton variant="text" width={100} height={14} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="85%" height={16} />
            </div>
          )}

          {/* Botão ver detalhes */}
          <Skeleton variant="rectangular" width="100%" height={38} className="rounded-lg" />
        </div>
      ))}
    </Stack>
  );
}
