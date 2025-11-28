import { useEffect, useMemo, useState } from "react";
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import CopyButton from "~/src/components/ui/CopyButton";
import Svg from "~/src/assets/svgs/_index";
import { useAnuncios, useChangeAdStatus } from "../../hooks";
import type { AdsFilters, Anuncio } from "../../typings";
import AnuncioListSkeleton from "./AnuncioListSkeleton";
import Speedometer from "../Speedometer/Speedometer";
import VisitsChart from "./VisitsChart";
import VariationsList from "./Variations/VariationsList";
import { formatCurrency, formatNumber } from "./utils";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import AnuncioStatusToggle from "../AnuncioStatusToggle";

interface AnunciosListProps {
  filters?: Partial<AdsFilters>;
}

export default function AnunciosList({ filters = {} }: AnunciosListProps) {
  const [page, setPage] = useState(filters.page ?? 1);
  const [perPage, setPerPage] = useState(filters.per_page ?? 20);
  const [mutatingAdId, setMutatingAdId] = useState<string | null>(null);

  useEffect(() => {
    setPage(filters.page ?? 1);
  }, [filters.page]);

  useEffect(() => {
    setPerPage(filters.per_page ?? 20);
  }, [filters.per_page]);

  const { data, isLoading, error } = useAnuncios({
    ...filters,
    page,
    per_page: perPage,
  });

  const changeStatusMutation = useChangeAdStatus();

  const anuncios = useMemo<Anuncio[]>(() => {
    if (!data?.success || !data.data?.ads) return [];
    return data.data.ads;
  }, [data]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? anuncios.length;

  const handleToggleStatus = (anuncio: Anuncio) => {
    if (anuncio.status === "closed") return;
    const nextStatus = anuncio.status === "active" ? "paused" : "active";
    setMutatingAdId(anuncio.mlb);
    changeStatusMutation.mutate(
      { adId: anuncio.mlb, status: nextStatus },
      {
        onSettled: () => {
          setMutatingAdId(null);
        },
      }
    );
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={AnuncioListSkeleton}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar os anúncios.
        </div>
      )}
    >
      <Stack spacing={2}>
        {anuncios.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <span className="text-slate-400">
              <Svg.information_circle tailWindClasses="h-10 w-10" />
            </span>
            <Typography variant="h6" color="text.secondary">
              Nenhum anúncio encontrado com os filtros atuais.
            </Typography>
          </div>
        ) : (
          <Stack spacing={2}>
            {anuncios.map((anuncio) => (
              <AnuncioCard
                key={anuncio.mlb}
                anuncio={anuncio}
                onToggleStatus={() => handleToggleStatus(anuncio)}
                isMutating={mutatingAdId === anuncio.mlb}
              />
            ))}
          </Stack>
        )}

        {totalPages > 1 ? (
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando página {page} de {totalPages} — {totalCount} anúncios no total
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          </Stack>
        ) : null}
      </Stack>
    </AsyncBoundary>
  );
}

interface AnuncioCardProps {
  anuncio: Anuncio;
  onToggleStatus: () => void;
  isMutating: boolean;
}

function AnuncioCard({ anuncio, onToggleStatus, isMutating }: AnuncioCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = anuncio.status === "active";
  const healthScore = anuncio.health?.score ?? null;
  const reputation = anuncio.experience?.reputation;
  const conversionRate = anuncio.conversion_rate ? parseFloat(anuncio.conversion_rate) : null;
  const hasVariations = anuncio.variations && anuncio.variations.length > 0;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <MainCards>
      <div className="grid grid-cols-12 gap-4">
        {/* Coluna Esquerda: Produto */}
        <div className="col-span-12 md:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <Thumbnail thumbnail={anuncio.thumbnail ?? ""} />
              {hasVariations && (
                <button
                  onClick={handleToggleExpansion}
                  className="absolute -right-1 -top-1 md:flex hidden items-center justify-center w-6 h-6 md:w-5 md:h-5 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 active:bg-blue-700 transition-colors z-10 touch-manipulation"
                  aria-label={isExpanded ? "Recolher variações" : "Expandir variações"}
                >
                  <Svg.chevron
                    tailWindClasses={`h-3.5 w-3.5 md:h-3 md:w-3 transition-transform duration-200 ${
                      isExpanded ? "rotate-270" : "rotate-90"
                    }`}
                  />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex md:items-center items-start md:flex-row flex-col gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <Typography variant="caption" color="text.secondary" className="font-mono">
                    # {anuncio.mlb}
                  </Typography>
                  <CopyButton
                    textToCopy={anuncio.mlb}
                    successMessage="MLB copiado para a área de transferência"
                    iconSize="h-4 w-4"
                    ariaLabel="Copiar MLB"
                  />
                </div>
                {anuncio.sku && (
                  <>
                    <span className="text-slate-300 hidden md:inline">|</span>
                    <div className="flex items-center gap-2">
                      <Typography variant="caption" color="text.secondary">
                        SKU {anuncio.sku}
                      </Typography>
                      {anuncio.sku && (
                        <CopyButton
                          textToCopy={anuncio.sku}
                          successMessage="SKU copiado para a área de transferência"
                          iconSize="h-4 w-4"
                          ariaLabel="Copiar SKU"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
              <Typography
                variant="body2"
                fontWeight={600}
                className="text-slate-900 mb-2 truncate max-w-[90%]"
              >
                {anuncio.name}
              </Typography>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {anuncio.ad_type && (
                  <Chip
                    label={anuncio.ad_type}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      backgroundColor: anuncio.ad_type === "Premium" ? "#fef3c7" : "#f0fdf4",
                      color: anuncio.ad_type === "Premium" ? "#92400e" : "#166534",
                    }}
                  />
                )}
                {anuncio.logistic_type && (() => {
                  const logisticTypeInfo = getLogisticTypeMeliInfo(anuncio.logistic_type);
                  return (
                    <Chip
                      label={logisticTypeInfo.label}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        backgroundColor: logisticTypeInfo.backgroundColor,
                        color: logisticTypeInfo.color,
                      }}
                    />
                  );
                })()}
                {anuncio.free_shipping && (
                  <Chip
                    label="Frete grátis"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                    }}
                  />
                )}
                {anuncio.catalog_product_id && (
                  <Chip
                    label="Catálogo"
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      backgroundColor: "#f3e8ff",
                      color: "#7c3aed",
                    }}
                  />
                )}
              </div>
              <Typography variant="caption" color="text.secondary">
                {anuncio.stock} unidades
              </Typography>
            </div>
          </div>
          {anuncio.visits && anuncio.visits.length > 0 && (
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
              <Typography variant="caption" color="text.secondary" className="block mb-1 text-xs">
                Evolução de visitas (últimos 5 meses)
              </Typography>
              <VisitsChart visits={anuncio.visits} />
            </div>
          )}
        </div>

        {/* Coluna do Meio: Vendas e Preço */}
        <div className="col-span-12 md:col-span-4 space-y-2">
          <div>
            <Typography variant="caption" color="text.secondary" className="block mb-0.5">
              Vendas e visitas
            </Typography>
            <Typography variant="body2" fontWeight={600} className="text-slate-900">
              {formatNumber(anuncio.geral_visits)} visitas | {formatNumber(anuncio.sold_quantity)}{" "}
              unidades vendidas
            </Typography>
            {conversionRate !== null && (
              <Typography variant="caption" color="text.secondary" className="mt-0.5 block">
                Taxa de conversão: <span className="font-semibold">{conversionRate.toFixed(2)}%</span>
              </Typography>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Typography variant="h6" fontWeight={700} className="text-slate-900">
                {formatCurrency(anuncio.price)}
              </Typography>
            </div>

            {anuncio.commission && (
              <div className={` border ${anuncio.ad_type === "Premium" ? "border-amber-200 bg-amber-50" : "border-green-200 bg-green-50"} rounded-lg p-2 mt-2`}>
                <Typography variant="caption" color="text.secondary" className="block mb-1">
                  {anuncio.ad_type || "Premium"}
                </Typography>
                <div className="space-y-0.5">
                  <Typography variant="caption" className="text-slate-700">
                    Tarifa de venda {anuncio.commission.percentage}%
                  </Typography>
                  {anuncio.commission.details?.fixed_fee != null &&
                    anuncio.commission.details.fixed_fee > 0 && (
                      <Typography variant="caption" className="text-slate-700 block">
                        + {formatCurrency(anuncio.commission.details.fixed_fee)}
                      </Typography>
                    )}
                  <Typography variant="caption" fontWeight={600} className="text-slate-900 block">
                    A pagar {formatCurrency(anuncio.commission.value)}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Qualidade e Status */}
        <div className="col-span-12 md:col-span-3 space-y-3">
          {/* Qualidade do Anúncio */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Speedometer value={healthScore} size={40} />
              <div>
                <Typography variant="caption" fontWeight={600} className="text-slate-900">
                  Qualidade do anúncio
                </Typography>
                <Typography variant="caption" color="text.secondary" className="block">
                  {healthScore !== null
                    ? healthScore >= 80
                      ? "Profissional"
                      : healthScore >= 60
                        ? "Mediano"
                        : "Crítico"
                    : "—"}
                </Typography>
              </div>
            </div>
            {anuncio.health?.buckets?.[0]?.variables?.[0]?.rules?.[0]?.wordings && (
              <div className="mt-2">
                <Typography variant="caption" color="text.secondary" className="block mb-1">
                  {anuncio.health.buckets[0].variables[0].rules[0].wordings.title}
                </Typography>
                {anuncio.health.buckets[0].variables[0].rules[0].wordings.link && (
                  <Link
                    to={anuncio.health.buckets[0].variables[0].rules[0].wordings.link}
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {anuncio.health.buckets[0].variables[0].rules[0].wordings.label}
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Experiência de Compra */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Speedometer value={reputation?.value ?? null} size={40} />
              <div>
                <Typography variant="caption" fontWeight={600} className="text-slate-900">
                  Experiência de compra
                </Typography>
                <Typography variant="caption" color="text.secondary" className="block">
                  {reputation?.text || "—"}
                </Typography>
              </div>
            </div>
            {anuncio.experience?.subtitles?.[0] && (
              <Typography variant="caption" color="text.secondary" className="block">
                {anuncio.experience.subtitles[0].text}
              </Typography>
            )}
          </div>

          {/* Status e Ações */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <AnuncioStatusToggle
                status={anuncio.status}
                subStatus={anuncio.sub_status}
                isActive={isActive}
                isMutating={isMutating}
                onToggle={onToggleStatus}
                showStatusMessage={false}
              />
              <IconButton size="small" onClick={handleMenuOpen}>
                <Svg.elipsis_horizontal tailWindClasses="h-5 w-5" />
              </IconButton>
            </div>
            <AnuncioStatusToggle
              status={anuncio.status}
              subStatus={anuncio.sub_status}
              isActive={isActive}
              isMutating={isMutating}
              onToggle={onToggleStatus}
              showStatusMessage={true}
              showControl={false}
            />
          </div>
          {hasVariations && (
                <button
                  onClick={handleToggleExpansion}
                  className="mt-2 flex items-center gap-2 w-full md:w-auto px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors touch-manipulation md:hidden"
                  aria-label={isExpanded ? "Recolher variações" : "Expandir variações"}
                >
                  <Svg.chevron
                    tailWindClasses={`h-4 w-4 transition-transform duration-200 ${
                      isExpanded ? "rotate-270" : "rotate-90"
                    }`}
                  />
                  <Typography variant="caption" className="text-blue-700 font-semibold">
                    {isExpanded ? "Ocultar" : "Ver"} {anuncio.variations?.length || 0} variaç{anuncio.variations?.length === 1 ? "ão" : "ões"}
                  </Typography>
                </button>
              )}
        </div>
      </div>

      {/* Seção de Variações Expandida */}
      {hasVariations && isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <VariationsList
            variations={anuncio.variations || []}
            anuncio={anuncio}
          />
        </div>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          component={Link}
          to={`/interno/anuncios/${anuncio.mlb}`}
          onClick={handleMenuClose}
        >
          Ver detalhes
        </MenuItem>
        {anuncio.link && (
          <MenuItem
            component="a"
            href={anuncio.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMenuClose}
          >
            Ver no Mercado Livre
          </MenuItem>
        )}
      </Menu>
    </MainCards>
  );
}
