import { Skeleton } from "@mui/material";

interface ChoosenAccountSkeletonProps {
  count?: number;
}

// Esqueleto que simula EXATAMENTE o MarketplaceCard
export default function ChoosenAccountSkeleton({ count = 8 }: ChoosenAccountSkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          className="group flex justify-center items-center relative mb-4 p-8 shadow-lg/55 rounded-2xl flex-col gap-2 border-2 bg-beergam-white border-transparent"
        >
          {/* Badge no topo direito (skeleton) */}
          <div className="absolute top-2 right-2">
            <Skeleton
              variant="rectangular"
              width={40}
              height={40}
              animation="wave"
              sx={{ borderRadius: "8px" }}
            />
          </div>

          {/* Imagem principal do marketplace */}
          <Skeleton
            variant="rectangular"
            width={176}
            height={176}
            animation="wave"
            sx={{ borderRadius: "16px" }}
          />

          {/* Nome do marketplace */}
          <Skeleton
            variant="text"
            width={200}
            height={24}
            animation="wave"
            sx={{ borderRadius: "4px" }}
          />

          {/* Container dos Status Tags */}
          <div className="flex flex-col gap-1 items-center">
            <Skeleton
              variant="rounded"
              width={120}
              height={24}
              animation="wave"
              sx={{ borderRadius: "12px" }}
            />
            <Skeleton
              variant="rounded"
              width={120}
              height={24}
              animation="wave"
              sx={{ borderRadius: "12px" }}
            />
          </div>
        </div>
      ))}
    </>
  );
}


