import { Skeleton } from "@mui/material";

export default function TopAnunciosVendidosSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-5">
      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className="relative flex h-full flex-col gap-4 rounded-2xl border border-black/5 dark:border-white/10 bg-beergam-section-background p-4 sm:p-5 shadow-md shadow-slate-200/40 dark:shadow-black/20"
        >
          {/* Badge de posição */}
          <div className="absolute left-0 top-0">
            <Skeleton
              variant="rectangular"
              width={32}
              height={32}
              sx={{
                borderRadius: "16px 0 16px 0",
              }}
            />
          </div>

          {/* Thumbnail e informações básicas */}
          <div className="flex items-start gap-3 sm:gap-4 pt-1">
            <Skeleton
              variant="rectangular"
              width={56}
              height={56}
              sx={{
                borderRadius: "16px",
                "@media (min-width: 640px)": {
                  width: 64,
                  height: 64,
                },
              }}
            />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton
                variant="text"
                width="100%"
                height={16}
                sx={{
                  "@media (min-width: 640px)": {
                    height: 20,
                  },
                }}
              />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Skeleton
                  variant="text"
                  width={50}
                  height={12}
                  sx={{
                    "@media (min-width: 640px)": {
                      width: 60,
                      height: 16,
                    },
                  }}
                />
                <span className="text-beergam-typography-secondary text-[10px] sm:text-xs">•</span>
                <Skeleton
                  variant="text"
                  width={60}
                  height={12}
                  sx={{
                    "@media (min-width: 640px)": {
                      width: 70,
                      height: 16,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2">
            {/* Stat Visitas */}
            <div className="flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/10 bg-beergam-mui-paper px-2 sm:px-3 py-1.5 sm:py-2">
              <Skeleton
                variant="rectangular"
                width={24}
                height={24}
                sx={{
                  borderRadius: "8px",
                  "@media (min-width: 640px)": {
                    width: 28,
                    height: 28,
                  },
                }}
              />
              <div className="flex-1 min-w-0">
                <Skeleton
                  variant="text"
                  width={45}
                  height={10}
                  sx={{
                    "@media (min-width: 640px)": {
                      width: 50,
                      height: 11,
                    },
                  }}
                />
                <Skeleton
                  variant="text"
                  width={55}
                  height={14}
                  sx={{
                    mt: 0.5,
                    "@media (min-width: 640px)": {
                      width: 60,
                      height: 16,
                    },
                  }}
                />
              </div>
            </div>

            {/* Stat Estoque */}
            <div className="flex items-center gap-2 rounded-xl border border-black/5 dark:border-white/10 bg-beergam-mui-paper px-2 sm:px-3 py-1.5 sm:py-2">
              <Skeleton
                variant="rectangular"
                width={24}
                height={24}
                sx={{
                  borderRadius: "8px",
                  "@media (min-width: 640px)": {
                    width: 28,
                    height: 28,
                  },
                }}
              />
              <div className="flex-1 min-w-0">
                <Skeleton
                  variant="text"
                  width={45}
                  height={10}
                  sx={{
                    "@media (min-width: 640px)": {
                      width: 50,
                      height: 11,
                    },
                  }}
                />
                <Skeleton
                  variant="text"
                  width={70}
                  height={14}
                  sx={{
                    mt: 0.5,
                    "@media (min-width: 640px)": {
                      width: 80,
                      height: 16,
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Botão */}
          <div className="mt-auto">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={32}
              sx={{
                borderRadius: "9999px",
                "@media (min-width: 640px)": {
                  height: 36,
                },
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}



