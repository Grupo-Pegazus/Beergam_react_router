import { Skeleton, Stack } from "@mui/material";

export default function QuestionsListSkeleton() {
  return (
    <Stack spacing={3}>
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="rounded-2xl p-4 shadow-sm flex flex-col gap-3 bg-beergam-section-background border border-black/5 dark:border-white/10"
        >
          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              {/* Item info */}
              <div className="flex items-center gap-2">
                <Skeleton variant="text" width={120} height={14} />
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={80} height={14} />
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton variant="text" width={100} height={14} />
              </div>
              {/* Texto da pergunta */}
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="70%" height={20} />
              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-1">
                <Skeleton variant="rectangular" width={100} height={24} className="rounded-full" />
                <Skeleton variant="rectangular" width={140} height={24} className="rounded-full" />
              </div>
            </div>
            {/* Botão responder */}
            <Skeleton variant="rectangular" width={100} height={36} className="rounded-lg" />
          </div>

          {/* Resposta (opcional) */}
          {index % 2 === 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-3">
              <Skeleton variant="text" width={80} height={14} className="mb-2" />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="80%" height={16} />
            </div>
          )}

          {/* Botão ver detalhes */}
          <Skeleton variant="rectangular" width="100%" height={40} className="rounded-lg" />
        </div>
      ))}
    </Stack>
  );
}

