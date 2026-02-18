import { Skeleton, Stack } from "@mui/material";

export default function ClaimsListSkeleton() {
  return (
    <Stack spacing={3}>
      {[1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="rounded-2xl p-4 shadow-sm flex flex-col gap-4 bg-beergam-section-background border border-black/5 dark:border-white/10"
        >
          {/* Cabeçalho */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              {/* IDs em linha - estilo perguntas */}
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton
                  variant="text"
                  width={120}
                  height={14}
                  sx={{ borderRadius: '4px' }}
                />
                <Skeleton
                  variant="circular"
                  width={14}
                  height={14}
                />
                <Skeleton
                  variant="text"
                  width={100}
                  height={14}
                  sx={{ borderRadius: '4px' }}
                />
                <Skeleton
                  variant="circular"
                  width={14}
                  height={14}
                />
              </div>
              {/* Reason ou título */}
              <Skeleton
                variant="text"
                width="90%"
                height={20}
                sx={{ borderRadius: '4px' }}
              />
              <Skeleton
                variant="text"
                width="70%"
                height={20}
                sx={{ borderRadius: '4px' }}
              />
              {/* Tags de status e data */}
              <div className="flex flex-wrap gap-2 mt-1">
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={24}
                  className="rounded-full"
                />
                <Skeleton
                  variant="rectangular"
                  width={140}
                  height={24}
                  className="rounded-full"
                />
                <Skeleton
                  variant="rectangular"
                  width={160}
                  height={24}
                  className="rounded-full"
                />
              </div>
            </div>
            {/* Botão ir para chat */}
            <Skeleton
              variant="rectangular"
              width={100}
              height={36}
              className="rounded-lg shrink-0"
            />
          </div>

          {/* Preview de mensagens (opcional) */}
          {index % 2 === 0 && (
            <div className="relative">
              <div className="space-y-1.5 mb-6">
                <div className="flex items-start gap-2">
                  <Skeleton
                    variant="text"
                    width={60}
                    height={14}
                    sx={{ borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={14}
                    sx={{ borderRadius: '4px' }}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <Skeleton
                    variant="text"
                    width={60}
                    height={14}
                    sx={{ borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={14}
                    sx={{ borderRadius: '4px' }}
                  />
                </div>
              </div>
              <Skeleton
                variant="text"
                width={200}
                height={14}
                sx={{ borderRadius: '4px' }}
              />
            </div>
          )}

          {/* Botão ver detalhes */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            className="rounded-lg"
          />
        </div>
      ))}
    </Stack>
  );
}
