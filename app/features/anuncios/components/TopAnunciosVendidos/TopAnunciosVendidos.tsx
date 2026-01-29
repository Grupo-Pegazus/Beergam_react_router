import type { ReactNode } from "react";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import {
  CensorshipWrapper,
  ImageCensored,
  TextCensored,
} from "~/src/components/utils/Censorship";
import { formatCurrency } from "~/src/utils/formatters/formatCurrency";
import { useTopSoldAds } from "../../hooks";
import type { Anuncio } from "../../typings";
import TopAnunciosVendidosSkeleton from "./TopAnunciosVendidosSkeleton";
import BeergamButton from "~/src/components/utils/BeergamButton";
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
          <p className="mt-2 text-sm text-beergam-typography-secondary">
            Nenhum destaque encontrado no momento.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-5">
          {topAnuncios.map((anuncio, index) => (
            <CensorshipWrapper
              key={anuncio.mlb}
              censorshipKey={`resumo_top_anuncios_vendidos_${index + 1}`}
            >
              <HighlightCard
                key={anuncio.mlb}
                anuncio={anuncio as Anuncio}
                position={index + 1}
                censorshipKey={`resumo_top_anuncios_vendidos_${index + 1}`}
              />
            </CensorshipWrapper>
          ))}
        </div>
      )}
    </AsyncBoundary>
  );
}

function HighlightCard({
  anuncio,
  position,
  censorshipKey,
}: {
  anuncio: Anuncio;
  position: number;
  censorshipKey: string;
}) {
  return (
    <MainCards className="relative flex h-full flex-col gap-4 p-4 sm:p-5">
      <div className="absolute left-0 top-0 z-40">
        <span className="flex h-8 w-8 items-center justify-center rounded-tl-[8px] rounded-br-[8px] bg-amber-500 text-xs sm:text-sm font-bold text-white shadow-md">
          {position}º
        </span>
      </div>
      <div className="flex items-start gap-3 sm:gap-4 pt-1">
        <ImageCensored className="w-12! h-12! md:w-16! md:h-16! shrink-0" censorshipKey={censorshipKey}>
          <Thumbnail thumbnail={anuncio.thumbnail} name={anuncio.name} />
        </ImageCensored>
        <div className="min-w-0 flex-1 space-y-1">
          <TextCensored
            censorshipKey={censorshipKey}
            maxCharacters={5}
            className="block max-w-full! truncate! text-xs! sm:text-sm! font-semibold! text-beergam-typography-primary!"
          >
            {anuncio.name}
          </TextCensored>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-xs text-beergam-typography-secondary">
            <TextCensored censorshipKey={censorshipKey} maxCharacters={1}>
              {formatCurrency(anuncio.price)}
            </TextCensored>
            <span className="text-beergam-typography-tertiary">•</span>
            <TextCensored censorshipKey={censorshipKey} maxCharacters={1}>
              {anuncio.sold_quantity} vendas
            </TextCensored>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs text-beergam-typography-secondary">
        <HighlightStat
          icon={
            <span className="text-beergam-white">
              <Svg.graph tailWindClasses="h-5 w-5" />
            </span>
          }
          label="Visitas"
          value={formatNumber(anuncio.geral_visits)}
        />
        <HighlightStat
          icon={
            <span className="text-beergam-white">
              <Svg.in_box_stack tailWindClasses="h-5 w-5" />
            </span>
          }
          label="Estoque"
          value={`${anuncio.stock} unidades`}
        />
      </div>
      <div className="mt-auto flex flex-col gap-2">
        <BeergamButton
          link={`/interno/anuncios/${anuncio.mlb}`}
          icon="eye"
          title="Ver na Beergam"
        />
        <BeergamButton
          link={`${anuncio.link}`}
          icon="eye"
          title="Ver no marketplace"
        />
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
    <div className="flex items-center gap-2 rounded-xl border border-beergam-input-border bg-beergam-section-background px-2 sm:px-3 py-1.5 sm:py-2">
      <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-beergam-primary shadow-inner shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide text-beergam-typography-secondary truncate">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-beergam-typography-primary truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function formatNumber(value: number | null | undefined) {
  return (value ?? 0).toLocaleString("pt-BR");
}
