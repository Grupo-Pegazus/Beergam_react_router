import { Skeleton } from "@mui/material";

// Skeleton que simula EXATAMENTE os cards de planos
export default function PlansSkeleton() {
  const skeletonPlans = Array.from({ length: 3 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {skeletonPlans.map((_, idx) => (
        <div
          key={idx}
          className="group relative w-full bg-beergam-white rounded-2xl shadow-lg/55 p-6 border-2 border-beergam-blue-light"
        >
          {/* Badge "Mais Popular" no meio (simulando o card do meio) */}
          {idx === 1 && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Skeleton
                variant="rounded"
                width={100}
                height={24}
                animation="wave"
                sx={{ borderRadius: "9999px" }}
              />
            </div>
          )}

          {/* Header do Plano */}
          <div className="text-center mb-6">
            {/* Ícone do plano */}
            <div className="inline-flex items-center justify-center mb-4">
              <Skeleton
                variant="rounded"
                width={48}
                height={48}
                animation="wave"
                sx={{ borderRadius: "12px" }}
              />
            </div>

            {/* Nome do plano */}
            <Skeleton
              variant="text"
              width={80}
              height={24}
              animation="wave"
              sx={{ margin: "0 auto 12px auto", borderRadius: "4px" }}
            />

            {/* Preço */}
            <div className="flex items-center justify-center gap-1 mb-4">
              <Skeleton
                variant="text"
                width={100}
                height={48}
                animation="wave"
                sx={{ borderRadius: "4px" }}
              />
              <Skeleton
                variant="text"
                width={40}
                height={20}
                animation="wave"
                sx={{ borderRadius: "4px" }}
              />
            </div>
          </div>

          {/* Lista de Benefícios */}
          <div className="space-y-3 mb-6">
            {Array.from({ length: 7 }).map((_, benefitIdx) => (
              <div key={benefitIdx} className="flex items-start">
                {/* Check mark */}
                <div className="shrink-0 mr-3 mt-0.5">
                  <Skeleton
                    variant="circular"
                    width={20}
                    height={20}
                    animation="wave"
                  />
                </div>
                {/* Texto do benefício */}
                <div className="flex-1">
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={16}
                    animation="wave"
                    sx={{ borderRadius: "4px" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Botão CTA */}
          <Skeleton
            variant="rounded"
            width="100%"
            height={48}
            animation="wave"
            sx={{ borderRadius: "16px" }}
          />
        </div>
      ))}
    </div>
  );
}