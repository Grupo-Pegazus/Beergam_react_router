import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import CopyButton from "~/src/components/ui/CopyButton";
import MainCards from "~/src/components/ui/MainCards";
import PaginationBar from "~/src/components/ui/PaginationBar";
import Alert from "~/src/components/utils/Alert";
import { ImageCensored, TextCensored } from "~/src/components/utils/Censorship";
import type { ModalOptions } from "~/src/components/utils/Modal/ModalContext";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { getLogisticTypeMeliInfo } from "~/src/constants/logistic-type-meli";
import toast from "~/src/utils/toast";
import { useAnuncios, useChangeAdStatus, useAdsReprocessQuota, useReprocessAds } from "../../hooks";
import type { AdsFilters, Anuncio } from "../../typings";
import AnuncioStatusToggle from "../AnuncioStatusToggle";
import Speedometer from "../Speedometer/Speedometer";
import AnuncioListSkeleton from "./AnuncioListSkeleton";
import VariationsList from "./Variations/VariationsList";
import VisitsChart from "./VisitsChart";
import { formatCurrency, formatNumber } from "./utils";

interface AnunciosListProps {
  filters?: Partial<AdsFilters>;
}

export default function AnunciosList({ filters = {} }: AnunciosListProps) {
  const [page, setPage] = useState(filters.page ?? 1);
  const [perPage, setPerPage] = useState(filters.per_page ?? 20);
  const [mutatingAdId, setMutatingAdId] = useState<string | null>(null);
  const [reprocessingAdId, setReprocessingAdId] = useState<string | null>(null);
  const { openModal, closeModal } = useModal();

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
  const reprocessMutation = useReprocessAds();
  const { data: quotaData } = useAdsReprocessQuota();

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

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };
  const remainingQuota = quotaData?.success ? quotaData.data?.remaining ?? 0 : 0;
  return (
    <>
      {/* Container da lista de anúncios (alvo de scroll) */}
      <div id="ads-list">
        <AsyncBoundary
          isLoading={isLoading}
          error={error as unknown}
          Skeleton={AnuncioListSkeleton}
          ErrorFallback={() => (
            <div className="rounded-2xl border border-beergam-red/50 bg-beergam-red/10 text-beergam-red! p-4">
              Não foi possível carregar os anúncios.
            </div>
          )}
        >
          <Stack spacing={2}>
            {anuncios.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-beergam-typography-secondary!/50 bg-beergam-typography-secondary!/10 p-10 text-center">
                <span className="text-beergam-typography-secondary!">
                  <Svg.information_circle tailWindClasses="h-10 w-10" />
                </span>
                <Typography
                  variant="h6"
                  className="text-beergam-typography-secondary!"
                >
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
                    onReprocess={() => {
                      if (remainingQuota <= 0) {
                        toast.error("Sua cota mensal de reprocessamento de anúncios acabou.");
                        return;
                      }

                      const adId = anuncio.mlb;
                      const options: ModalOptions = {
                        title: "Confirmar reprocessamento do anúncio",
                      };

                      openModal(
                        <Alert
                          type="info"
                          confirmText="Reprocessar"
                          onClose={closeModal}
                          onConfirm={() => {
                            setReprocessingAdId(adId);
                            reprocessMutation.mutate([adId], {
                              onSettled: () => setReprocessingAdId(null),
                            });
                          }}
                        >
                          <h3 className="text-lg font-semibold text-beergam-typography-primary mb-2">
                            Deseja reprocessar o anúncio #{adId}?
                          </h3>
                          <p className="text-sm text-beergam-typography-secondary mb-2">
                            Essa ação irá buscar novamente os dados no Mercado Livre e atualizar o anúncio no Beergam.
                          </p>
                          <p className="text-xs text-beergam-typography-secondary">
                            Cota mensal de reprocessamento:{" "}
                            <strong>{quotaData?.data?.limit ?? 0}</strong> | Usados:{" "}
                            <strong>{quotaData?.data?.used ?? 0}</strong> | Restantes:{" "}
                            <strong>{remainingQuota}</strong>.
                          </p>
                        </Alert>,
                        options
                      );
                    }}
                    isMutating={mutatingAdId === anuncio.mlb}
                    isReprocessing={reprocessingAdId === anuncio.mlb}
                    remainingQuota={remainingQuota}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </AsyncBoundary>
      </div>

      {/* Paginação fixa fora do AsyncBoundary, com scroll controlado pelo componente */}
      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        entityLabel="anúncios"
        onChange={handlePageChange}
        scrollOnChange
        scrollTargetId="ads-list"
        isLoading={isLoading}
      />
    </>
  );
}

interface AnuncioCardProps {
  anuncio: Anuncio;
  onToggleStatus: () => void;
  onReprocess: () => void;
  isMutating: boolean;
  isReprocessing: boolean;
  remainingQuota: number;
}

function AnuncioCard({
  anuncio,
  onToggleStatus,
  onReprocess,
  isMutating,
  isReprocessing,
  remainingQuota,
}: AnuncioCardProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = anuncio.status === "active";
  const healthScore = anuncio.health?.score ?? null;
  const reputation = anuncio.experience?.reputation;
  const conversionRate = anuncio.conversion_rate
    ? parseFloat(anuncio.conversion_rate)
    : null;
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
              <ImageCensored className="w-12! h-12! md:w-16! md:h-16! shrink-0" censorshipKey="anuncios_list">
                <Thumbnail thumbnail={anuncio.thumbnail ?? ""} />
              </ImageCensored>
              {hasVariations && (
                <button
                  onClick={handleToggleExpansion}
                  className="absolute -right-1 -top-1 md:flex hidden items-center justify-center w-6 h-6 md:w-5 md:h-5 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 active:bg-blue-700 transition-colors z-10 touch-manipulation"
                  aria-label={
                    isExpanded ? "Recolher variações" : "Expandir variações"
                  }
                >
                  <Svg.chevron
                    tailWindClasses={`h-3.5 w-3.5 md:h-3 md:w-3 transition-transform duration-200 ${isExpanded ? "rotate-270" : "rotate-90"
                      }`}
                  />
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex md:items-center items-start md:flex-row flex-col gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <TextCensored censorshipKey="anuncios_list">
                    <Typography
                      variant="caption"
                      className="text-beergam-typography-secondary!"
                    >
                      # {anuncio.mlb}
                    </Typography>
                  </TextCensored>

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
                      <TextCensored censorshipKey="anuncios_list">
                        <Typography
                          variant="caption"
                          className="text-beergam-typography-secondary!"
                        >
                          SKU {anuncio.sku}
                        </Typography>
                      </TextCensored>
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
              <TextCensored censorshipKey="anuncios_list">
                <Typography
                  variant="body2"
                  fontWeight={600}
                  className="text-beergam-typography-primary! mb-2 truncate max-w-[90%]"
                >
                  {anuncio.name}
                </Typography>
              </TextCensored>
              <div className="flex flex-wrap items-center gap-1.5 mb-2 mt-2">
                {anuncio.ad_type && (
                  <Chip
                    label={anuncio.ad_type}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 600,
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
                    const logisticTypeInfo = getLogisticTypeMeliInfo(
                      anuncio.logistic_type
                    );
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
                {anuncio.is_catalog && (
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
              <Typography
                variant="caption"
                className="text-beergam-typography-secondary!"
              >
                {anuncio.stock} em estoque
              </Typography>
            </div>
          </div>
          {anuncio.visits && anuncio.visits.length > 0 && (
            <div className="mt-2 rounded-lg bg-beergam-typography-secondary!/10 p-2">
              <div className="flex items-center justify-between mb-1">
                <Typography
                  variant="caption"
                  className="text-beergam-typography-secondary!"
                >
                  Evolução de visitas
                </Typography>
                <Typography
                  variant="caption"
                  className="text-beergam-typography-secondary!"
                >
                  Últimos 5 meses
                </Typography>
              </div>
              <VisitsChart visits={anuncio.visits} />
            </div>
          )}
        </div>

        {/* Coluna do Meio: Vendas e Preço */}
        <div className="col-span-12 md:col-span-4 space-y-2">
          <div>
            <Typography
              variant="caption"
              className="text-beergam-typography-secondary!"
            >
              Vendas e visitas
            </Typography>
            <TextCensored censorshipKey="anuncios_list">
              <Typography
                variant="body2"
                fontWeight={600}
                className="text-beergam-typography-primary!"
              >
                {formatNumber(anuncio.geral_visits)} visitas |{" "}
                {formatNumber(anuncio.sold_quantity)} unidades vendidas
              </Typography>
            </TextCensored>
            {conversionRate !== null && (
              <Typography
                variant="caption"
                className="text-beergam-typography-tertiary!"
              >
                Taxa de conversão:{" "}
                <span className="font-semibold">
                  {conversionRate.toFixed(2)}%
                </span>
              </Typography>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <TextCensored censorshipKey="anuncios_list">
                <Typography
                  variant="h6"
                  fontWeight={700}
                  className="text-beergam-primary!"
                >
                  {formatCurrency(anuncio.price)}
                </Typography>
              </TextCensored>
            </div>

            {anuncio.commission && (
              <div
                className={` ${anuncio.ad_type === "Premium" ? "bg-beergam-orange/20" : "bg-beergam-menu-background/20"} rounded-lg p-2 mt-2`}
              >
                <Typography
                  variant="caption"
                  className={`${anuncio.ad_type === "Premium" ? "text-beergam-orange" : "text-beergam-secondary!"}`}
                >
                  {anuncio.ad_type || "Premium"}
                </Typography>
                <div className="space-y-0.5">
                  <Typography
                    variant="caption"
                    className="text-beergam-typography-tertiary!"
                  >
                    Tarifa de venda {anuncio.commission.percentage}%
                  </Typography>
                  {anuncio.commission.details?.fixed_fee != null &&
                    anuncio.commission.details.fixed_fee > 0 && (
                      <Typography
                        variant="caption"
                        className="text-beergam-typography-tertiary! block"
                      >
                        + {formatCurrency(anuncio.commission.details.fixed_fee)}
                      </Typography>
                    )}
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    className="text-beergam-typography-tertiary! block"
                  >
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
              <div className="flex items-center gap-2">
                <Typography
                  variant="caption"
                  fontWeight={600}
                  className="text-beergam-typography-primary!"
                >
                  Qualidade do anúncio
                </Typography>
                <Typography
                  variant="caption"
                  className="text-beergam-typography-secondary!"
                >
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
            {anuncio.health?.buckets?.[0]?.variables?.[0]?.rules?.[0]
              ?.wordings && (
                <div className="mt-2">
                  <Typography
                    variant="caption"
                    className="text-beergam-typography-secondary!"
                  >
                    {`${anuncio.health.buckets[0].variables[0].rules[0].wordings.title} `}
                  </Typography>
                  {anuncio.health.buckets[0].variables[0].rules[0].wordings
                    .link && (
                      <Link
                        to={
                          anuncio.health.buckets[0].variables[0].rules[0].wordings
                            .link
                        }
                        target="_blank"
                        className="text-xs text-beergam-primary! hover:underline"
                      >
                        {
                          anuncio.health.buckets[0].variables[0].rules[0].wordings
                            .label
                        }
                      </Link>
                    )}
                </div>
              )}
          </div>

          {/* Experiência de Compra */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Speedometer value={reputation?.value ?? null} size={40} />
              <div className="flex items-center gap-2">
                <Typography
                  variant="caption"
                  fontWeight={600}
                  className="text-beergam-typography-primary!"
                >
                  Experiência de compra
                </Typography>
                <Typography
                  variant="caption"
                  className="text-beergam-typography-secondary!"
                >
                  {reputation?.text || "—"}
                </Typography>
              </div>
            </div>
            {anuncio.experience?.subtitles?.[0] && (
              <Typography
                variant="caption"
                className="text-beergam-typography-secondary!"
              >
                {anuncio.experience.subtitles[0].text}
              </Typography>
            )}
          </div>

          {/* Status e Ações */}
          <div className="space-y-2 pt-2 border-t border-beergam-typography-secondary!/20">
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
              aria-label={
                isExpanded ? "Recolher variações" : "Expandir variações"
              }
            >
              <Svg.chevron
                tailWindClasses={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-270" : "rotate-90"
                  }`}
              />
              <Typography
                variant="caption"
                className="text-blue-700 font-semibold"
              >
                {isExpanded ? "Ocultar" : "Ver"}{" "}
                {anuncio.variations?.length || 0} variaç
                {anuncio.variations?.length === 1 ? "ão" : "ões"}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          component={Link}
          to={`/interno/anuncios/${anuncio.mlb}`}
          onClick={handleMenuClose}
        >
          Ver detalhes
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
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
            onClick={handleMenuClose}
          >
            Ver no Mercado Livre
          </MenuItem>
        )}
      </Menu>
    </MainCards>
  );
}
