import type { ReactNode } from "react";
import { useTopSoldAds } from "../../hooks";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";
import TopAnunciosVendidosSkeleton from "./TopAnunciosVendidosSkeleton";
import { Link } from "react-router";
import type { Anuncio } from "../../typings";
export default function TopAnunciosVendidos() {
  const { data, isLoading, error } = useTopSoldAds({
    limit: 5,
    sort_by: "sold_quantity",
    sort_order: "desc",
  });

  const topAnuncios = data?.success && data.data?.ads ? data.data.ads : [];

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={TopAnunciosVendidosSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar os anúncios mais vendidos.
        </div>
      )}
    >
      {topAnuncios.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-10 text-center">
          <Svg.warning_circle tailWindClasses="mx-auto h-8 w-8 text-amber-500" />
          <p className="mt-2 text-sm text-slate-500">Nenhum destaque encontrado no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-5">
          {topAnuncios.map((anuncio, index) => (
            <HighlightCard key={anuncio.mlb} anuncio={anuncio as Anuncio} position={index + 1} />
          ))}
        </div>
      )}
    </AsyncBoundary>
  );
}

function HighlightCard({ anuncio, position }: { anuncio: Anuncio; position: number }) {
  return (
    <MainCards className="relative flex h-full flex-col gap-4 p-4 sm:p-5">
      <div className="absolute left-0 top-0">
        <span className="flex h-8 w-8 items-center justify-center rounded-tl-[8px] rounded-br-[8px] bg-amber-500 text-xs sm:text-sm font-bold text-white shadow-md">
          {position}º
        </span>
      </div>
      <div className="flex items-start gap-3 sm:gap-4 pt-1">
        <Thumbnail thumbnail={anuncio.thumbnail} name={anuncio.name} />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{anuncio.name}</p>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-xs text-slate-500">
            <span>{formatPrice(anuncio.price)}</span>
            <span>•</span>
            <span>{anuncio.sold_quantity} vendas</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs text-slate-500">
        <HighlightStat
          icon={
            <span className="text-sky-500">
              <Svg.graph tailWindClasses="h-5 w-5" />
            </span>
          }
          label="Visitas"
          value={formatNumber(anuncio.geral_visits)}
        />
        <HighlightStat
          icon={
            <span className="text-emerald-500">
              <Svg.in_box_stack tailWindClasses="h-5 w-5" />
            </span>
          }
          label="Estoque"
          value={`${anuncio.stock} unidades`}
        />
      </div>
      <div className="mt-auto flex gap-2">
        <InternalButtonLink
          to={`/interno/anuncios/${anuncio.mlb}`}
          icon={
            <span className="text-amber-600">
              <Svg.eye tailWindClasses="h-5 w-5" />
            </span>
          }
        >
          Ver anúncio
        </InternalButtonLink>
      </div>
    </MainCards>
  );
}

interface ThumbnailProps {
  thumbnail?: string | null;
  name: string;
}

function Thumbnail({ thumbnail, name }: ThumbnailProps) {
  if (thumbnail) {
    return (
      <img
        src={thumbnail}
        alt={name}
        className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl object-cover shadow-inner shrink-0"
      />
    );
  }
  return (
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 shrink-0">
      <Svg.bag tailWindClasses="h-5 w-5 sm:h-6 sm:w-6" />
    </div>
  );
}

interface HighlightStatProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function HighlightStat({ icon, label, value }: HighlightStatProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-2 sm:px-3 py-1.5 sm:py-2">
      <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-white shadow-inner shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-slate-400 truncate">{label}</p>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

interface ButtonBaseProps {
  icon: ReactNode;
  children: ReactNode;
}

function InternalButtonLink({ to, icon, children }: ButtonBaseProps & { to: string }) {
  return (
    <Link
      to={to}
      className="flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-amber-300 bg-amber-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-amber-600 transition hover:bg-amber-100"
    >
      {icon}
      <span className="truncate">{children}</span>
    </Link>
  );
}

function formatPrice(price: string | null | undefined): string {
  if (!price || Number.isNaN(parseFloat(price))) return "R$ 0,00";
  const numValue = parseFloat(price);
  if (!Number.isFinite(numValue)) return "R$ 0,00";
  return numValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("pt-BR");
}

