import { Skeleton } from "@mui/material";

export default function MinhaAssinaturaSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header da assinatura */}
      <div className="bg-beergam-blue-primary p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" width={180} height={28} animation="wave" sx={{ borderRadius: 6 }} />
          <Skeleton variant="rounded" width={120} height={32} animation="wave" sx={{ borderRadius: 9999 }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Skeleton variant="text" width={100} height={16} animation="wave" sx={{ borderRadius: 6, opacity: 0.8 }} />
            <Skeleton variant="text" width={160} height={22} animation="wave" sx={{ borderRadius: 6 }} />
          </div>
          <div>
            <Skeleton variant="text" width={80} height={16} animation="wave" sx={{ borderRadius: 6, opacity: 0.8 }} />
            <Skeleton variant="text" width={140} height={22} animation="wave" sx={{ borderRadius: 6 }} />
          </div>
          <div>
            <Skeleton variant="text" width={100} height={16} animation="wave" sx={{ borderRadius: 6, opacity: 0.8 }} />
            <Skeleton variant="text" width={140} height={22} animation="wave" sx={{ borderRadius: 6 }} />
          </div>
        </div>
      </div>

      {/* Benefícios do plano */}
      <div className="bg-beergam-white p-6 rounded-2xl shadow-lg">
        <Skeleton variant="text" width={220} height={22} animation="wave" sx={{ borderRadius: 6, mb: 2 }} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Skeleton variant="circular" width={24} height={24} animation="wave" />
              <Skeleton variant="text" width="80%" height={16} animation="wave" sx={{ borderRadius: 6 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Botão de gerenciar billing */}
      <div className="bg-beergam-white p-6 rounded-2xl shadow-lg">
        <Skeleton variant="text" width={200} height={20} animation="wave" sx={{ borderRadius: 6, mb: 2 }} />
        <Skeleton variant="text" width="70%" height={16} animation="wave" sx={{ borderRadius: 6, mb: 2, maxWidth: 520 }} />
        <Skeleton variant="text" width="60%" height={16} animation="wave" sx={{ borderRadius: 6, mb: 4, maxWidth: 420 }} />
        <Skeleton variant="rounded" width="100%" height={48} animation="wave" sx={{ borderRadius: 16 }} />
      </div>
    </div>
  );
}


