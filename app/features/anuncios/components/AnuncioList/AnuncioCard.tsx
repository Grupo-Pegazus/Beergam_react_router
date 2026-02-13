import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import CopyButton from "~/src/components/ui/CopyButton";
import MainCards from "~/src/components/ui/MainCards";
import { ImageCensored, TextCensored } from "~/src/components/utils/Censorship";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import { formatDate } from "~/features/agendamentos/utils";
import type { Anuncio } from "../../typings";
import AnuncioStatusToggle from "../AnuncioStatusToggle";
import Speedometer from "../Speedometer/Speedometer";
import VariationsList from "./Variations/VariationsList";
import VisitsChart from "./VisitsChart";
import { formatCurrency, formatNumber } from "./utils";

interface AnuncioCardProps {
  anuncio: Anuncio;
  onToggleStatus: () => void;
  onReprocess: () => void;
  isMutating: boolean;
  isReprocessing: boolean;
  remainingQuota: number;
}

const chipBase = "h-6! text-xs! font-medium! rounded-lg!";

export default function AnuncioCard({
  anuncio,
  onToggleStatus,
  onReprocess,
  isMutating,
  isReprocessing,
  remainingQuota,
}: AnuncioCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [chartExpanded, setChartExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [variationsExpanded, setVariationsExpanded] = useState(false);
  const isActive = anuncio.status === "active";
  const healthScore = anuncio.health?.score ?? null;
  const reputation = anuncio.experience?.reputation;
  const conversionRate = anuncio.conversion_rate
    ? parseFloat(anuncio.conversion_rate)
    : null;
  const hasVariations = anuncio.variations && anuncio.variations.length > 0;

  return (
    <MainCards className="overflow-hidden rounded-2xl border border-beergam-input-border/30">
      <div className="flex flex-col gap-4 p-4 md:p-5 md:gap-5">
        {/* Hero: Imagem + Nome + Preço — mobile e desktop */}
        <div className="flex gap-4 md:flex-row">
          <Link
            to={`/interno/anuncios/${anuncio.mlb}`}
            className="shrink-0 block"
          >
            <ImageCensored
              className="h-16! w-16! md:h-20! md:w-20! shrink-0 overflow-hidden rounded-xl object-cover"
              censorshipKey="anuncios_list"
            >
              <Thumbnail
                thumbnail={anuncio.thumbnail ?? ""}
                tailWindClasses="h-16! w-16! md:h-20! md:w-20! object-cover"
              />
            </ImageCensored>
          </Link>
          <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
            <div>
              <div className="mb-1 flex flex-wrap flex-col md:flex-row items-start gap-2">
                <div className="flex items-center gap-2">
                  <TextCensored censorshipKey="anuncios_list">
                    <span className="font-mono text-xs text-beergam-typography-secondary!">
                      #{anuncio.mlb}
                    </span>
                  </TextCensored>
                  <CopyButton
                    textToCopy={anuncio.mlb}
                    successMessage="MLB copiado"
                    iconSize="h-3.5 w-3.5"
                    ariaLabel="Copiar MLB"
                  />
                </div>
                {anuncio.sku && (
                  <>
                    <span className="text-beergam-typography-tertiary! hidden md:inline">·</span>
                    <div className="flex items-center gap-2">
                      <TextCensored censorshipKey="anuncios_list">
                        <span className="text-xs text-beergam-typography-secondary! truncate max-w-[120px] md:max-w-none">
                          {anuncio.sku}
                        </span>
                      </TextCensored>
                      <CopyButton
                        textToCopy={anuncio.sku}
                        successMessage="SKU copiado"
                        iconSize="h-3.5 w-3.5"
                        ariaLabel="Copiar SKU"
                      />
                    </div>
                  </>
                )}
              </div>
              <Link to={`/interno/anuncios/${anuncio.mlb}`} className="block">
                <TextCensored censorshipKey="anuncios_list">
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    className="text-beergam-typography-primary! line-clamp-2 hover:text-beergam-primary! transition-colors"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {anuncio.name}
                  </Typography>
                </TextCensored>
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <TextCensored censorshipKey="anuncios_list">
                <span className="text-lg md:text-xl font-bold text-beergam-primary! whitespace-nowrap">
                  {formatCurrency(anuncio.price)}
                </span>
              </TextCensored>
              {anuncio.commission && (
                <span className="text-xs text-beergam-typography-secondary!">
                  Tarifa de venda {anuncio.commission.percentage}%
                  {anuncio.commission.details?.fixed_fee != null &&
                    anuncio.commission.details.fixed_fee > 0 && (
                      <> + {formatCurrency(anuncio.commission.details.fixed_fee)} fixo</>
                    )}
                  {" — a pagar "}
                  <span className="font-medium text-beergam-typography-primary!">
                    {formatCurrency(anuncio.commission.value)}
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex shrink-0 items-start gap-2">
            <AnuncioStatusToggle
              status={anuncio.status}
              subStatus={anuncio.sub_status}
              isActive={isActive}
              isMutating={isMutating}
              onToggle={onToggleStatus}
              showStatusMessage={true}
            />
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-label="Menu de opções"
              className="rounded-xl! border! border-beergam-input-border/50! bg-transparent! hover:bg-beergam-section-background!"
            >
              <Svg.elipsis_horizontal tailWindClasses="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        {/* Tags — compactos, com respiro no mobile */}
        <div className="flex flex-wrap gap-2 md:gap-1.5">
          {anuncio.ad_type && (
            <Chip
              label={anuncio.ad_type}
              size="small"
              className={chipBase}
              sx={{
                backgroundColor:
                  anuncio.ad_type === "Premium"
                    ? "var(--color-beergam-orange-light)"
                    : "var(--color-beergam-menu-background)",
                color:
                  anuncio.ad_type === "Premium"
                    ? "var(--color-beergam-orange-dark)"
                    : "var(--color-beergam-white)",
              }}
            />
          )}
          {anuncio.logistic_type &&
            (() => {
              const info = getLogisticTypeMeliInfo(anuncio.logistic_type);
              return (
                <Chip
                  label={info.label}
                  size="small"
                  className={chipBase}
                  sx={{
                    backgroundColor: info.backgroundColor,
                    color: info.color,
                  }}
                />
              );
            })()}
          {anuncio.free_shipping && (
            <Chip
              label="Frete grátis"
              size="small"
              className={chipBase}
              sx={{ backgroundColor: "#dbeafe", color: "#1e40af" }}
            />
          )}
          {anuncio.is_catalog ? (
            <Chip
              label="Catálogo"
              size="small"
              className={chipBase}
              sx={{ backgroundColor: "#f3e8ff", color: "#7c3aed" }}
            />
          ) : (
            <Chip
              label="Tradicional"
              size="small"
              className={chipBase}
              sx={{ backgroundColor: "#dbeafe", color: "#1e40af" }}
            />
          )}
          {anuncio.flex && (
            <Chip
              label="Flex"
              size="small"
              className={chipBase}
              sx={{ backgroundColor: "#fef3c7", color: "#92400e" }}
            />
          )}
        </div>

        {/* Desktop: grid 2 colunas balanceadas — esquerda | direita */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-6 md:items-start">
          {/* Col esquerda: Métricas + gráfico */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-beergam-input-border/30 bg-beergam-section-background/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <Svg.eye tailWindClasses="h-4 w-4 text-beergam-typography-secondary!" />
                <TextCensored censorshipKey="anuncios_list">
                  <span className="text-sm font-medium text-beergam-typography-primary!">
                    {formatNumber(anuncio.geral_visits)} visitas
                  </span>
                </TextCensored>
              </div>
              <span className="text-beergam-typography-tertiary!">·</span>
              <span className="text-sm font-medium text-beergam-typography-primary!">
                {formatNumber(anuncio.sold_quantity)} vendidas
              </span>
              {conversionRate != null && (
                <>
                  <span className="text-beergam-typography-tertiary!">·</span>
                  <span className="text-sm text-beergam-typography-secondary!">
                    Conversão{" "}
                    <span className="font-semibold text-beergam-primary!">
                      {conversionRate.toFixed(2)}%
                    </span>
                  </span>
                </>
              )}
              <span className="text-beergam-typography-tertiary!">·</span>
              <span className="text-xs text-beergam-typography-secondary!">
                {anuncio.stock} estoque · {anuncio.active_days}d ativo
              </span>
            </div>
            {anuncio.visits && anuncio.visits.length > 0 && (
              <div className="rounded-xl border border-beergam-input-border/30 bg-beergam-section-background/80 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-sm font-medium text-beergam-typography-primary!">
                    Evolução de visitas
                  </span>
                  <span className="text-xs text-beergam-typography-secondary!">
                    Últimos 5 meses
                  </span>
                </div>
                <div className="border-t border-beergam-input-border/30 p-3">
                  <VisitsChart visits={anuncio.visits} />
                </div>
              </div>
            )}
            {anuncio.item_relations && anuncio.item_relations.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-beergam-typography-secondary!">
                <Svg.clip tailWindClasses="h-3.5 w-3.5" />
                Sincronizado com{" "}
                {anuncio.item_relations.map((r) => (
                  <span key={r.id} className="font-mono">{r.id}</span>
                ))}
              </div>
            )}
          </div>
          {/* Col direita: Qualidade + Experiência em card único preenchido */}
          <div className="rounded-xl border border-beergam-input-border/30 bg-beergam-section-background/80 p-4 flex flex-col gap-4 min-h-0 shadow-sm">
            <p className="text-sm font-medium text-beergam-typography-primary! shrink-0">
              Desempenho do anúncio
            </p>
            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-beergam-mui-paper border border-beergam-input-border/30 min-h-[100px]">
                <Speedometer value={healthScore} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-beergam-typography-primary!">
                    Qualidade do anúncio
                  </p>
                  <p className="text-sm font-medium text-beergam-typography-secondary!">
                    {healthScore != null
                      ? healthScore >= 80
                        ? "Profissional"
                        : healthScore >= 60
                          ? "Mediano"
                          : "Crítico"
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-beergam-mui-paper border border-beergam-input-border/30 min-h-[100px]">
                <Speedometer value={reputation?.value ?? null} size={44} className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-beergam-typography-primary! mb-1">
                    Experiência de compra
                  </p>
                  <p className="text-sm font-medium text-beergam-typography-secondary! leading-relaxed">
                    {reputation?.text ?? anuncio.experience?.subtitles?.[0]?.text ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: métricas + seções colapsáveis */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-beergam-section-background/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <Svg.eye tailWindClasses="h-4 w-4 text-beergam-typography-secondary!" />
              <TextCensored censorshipKey="anuncios_list">
                <span className="text-sm font-medium text-beergam-typography-primary!">
                  {formatNumber(anuncio.geral_visits)} visitas · {formatNumber(anuncio.sold_quantity)} vendidas
                </span>
              </TextCensored>
            </div>
            {conversionRate != null && (
              <span className="text-sm text-beergam-typography-secondary!">
                Conversão {conversionRate.toFixed(2)}%
              </span>
            )}
          </div>
          {anuncio.visits && anuncio.visits.length > 0 && (
            <div className="rounded-xl border border-beergam-input-border/30 overflow-hidden">
              <button
                type="button"
                onClick={() => setChartExpanded((p) => !p)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left bg-beergam-section-background/80 transition-colors"
              >
                <span className="text-sm font-medium text-beergam-typography-primary!">
                  Evolução de visitas
                </span>
                <Svg.chevron
                  tailWindClasses={`h-4 w-4 transition-transform ${chartExpanded ? "rotate-270" : "rotate-90"}`}
                />
              </button>
              {chartExpanded && (
                <div className="border-t border-beergam-input-border/30 bg-beergam-section-background/80 p-3">
                  <VisitsChart visits={anuncio.visits} />
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-beergam-input-border/30 bg-beergam-section-background/80 p-3 min-h-[72px]">
              <Speedometer value={healthScore} size={36} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-beergam-typography-primary!">
                  Qualidade do anúncio
                </p>
                <p className="text-xs text-beergam-typography-secondary!">
                  {healthScore != null ? (healthScore >= 80 ? "Profissional" : healthScore >= 60 ? "Mediano" : "Crítico") : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-beergam-input-border/30 bg-beergam-section-background/80 p-3 min-h-[72px]">
              <Speedometer value={reputation?.value ?? null} size={36} className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-beergam-typography-primary! mb-1">
                  Experiência de compra
                </p>
                <p className="text-xs text-beergam-typography-secondary! leading-relaxed">
                  {reputation?.text ?? anuncio.experience?.subtitles?.[0]?.text ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalhes extras — colapsáveis somente mobile */}
        <div className="rounded-xl border border-beergam-input-border/30 bg-beergam-section-background/80 overflow-hidden">
          <button
            type="button"
            onClick={() => setDetailsExpanded((p) => !p)}
            className="flex w-full items-center justify-between rounded-xl border border-beergam-input-border/30 px-4 py-2.5 text-left md:hidden bg-beergam-section-background/80 transition-colors"
          >
            <span className="text-sm text-beergam-typography-secondary!">
              Estoque, data de criação, sincronização
            </span>
            <Svg.chevron
              tailWindClasses={`h-4 w-4 transition-transform ${detailsExpanded ? "rotate-270" : "rotate-90"}`}
            />
          </button>
          <div
            className={`gap-2 p-3 ${detailsExpanded ? "grid" : "hidden"} md:hidden`}
          >
            <div className="flex items-center gap-2 text-xs text-beergam-typography-secondary!">
              {anuncio.stock} em estoque · Criado em {formatDate(anuncio.date_created_ad)} · {anuncio.active_days} dias ativo
            </div>
            {anuncio.item_relations && anuncio.item_relations.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-beergam-typography-secondary!">
                <Svg.clip tailWindClasses="h-3.5 w-3.5" />
                Sincronizado com{" "}
                {anuncio.item_relations.map((r) => (
                  <span key={r.id} className="font-mono">{r.id}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ações — mobile */}
        <div className="flex items-center justify-between gap-2 border-t border-beergam-input-border/30 pt-4 md:hidden">
          <AnuncioStatusToggle
            status={anuncio.status}
            subStatus={anuncio.sub_status}
            isActive={isActive}
            isMutating={isMutating}
            onToggle={onToggleStatus}
            showStatusMessage={true}
          />
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-label="Menu de opções"
            className="!rounded-xl !border !border-beergam-input-border/50"
          >
            <Svg.elipsis_horizontal tailWindClasses="h-5 w-5" />
          </IconButton>
        </div>

        {/* Variações */}
        {hasVariations && (
          <div>
            <button
              type="button"
              onClick={() => setVariationsExpanded((p) => !p)}
              className="flex w-full items-center gap-2 rounded-xl border border-beergam-blue/30 bg-beergam-primary-light/50 px-4 py-2.5 text-left hover:bg-beergam-primary-light/70 transition-colors dark:border-beergam-blue/40 dark:bg-beergam-section-background dark:hover:bg-beergam-mui-paper"
            >
              <Svg.chevron
                tailWindClasses={`h-4 w-4 transition-transform ${variationsExpanded ? "rotate-90" : ""}`}
              />
              <span className="text-sm font-medium text-beergam-typography-primary!">
                Ver {anuncio.variations?.length} variaç
                {anuncio.variations?.length === 1 ? "ão" : "ões"}
              </span>
            </button>
            {variationsExpanded && (
              <div className="mt-3 border-t border-beergam-input-border/30 pt-3">
                <VariationsList
                  variations={anuncio.variations || []}
                  anuncio={anuncio}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          component={Link}
          to={`/interno/anuncios/${anuncio.mlb}`}
          onClick={() => setAnchorEl(null)}
        >
          Ver detalhes
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onReprocess();
          }}
          disabled={isReprocessing || remainingQuota <= 0}
        >
          {isReprocessing ? "Reprocessando..." : "Reprocessar"}
        </MenuItem>
        {anuncio.link && (
          <MenuItem
            component="a"
            href={anuncio.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setAnchorEl(null)}
          >
            Ver no Mercado Livre
          </MenuItem>
        )}
      </Menu>
    </MainCards>
  );
}
