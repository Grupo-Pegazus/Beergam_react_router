import { Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { anuncioService } from "~/features/anuncios/service";
import Thumbnail from "~/src/components/Thumbnail/Thumbnail";
import CopyButton from "~/src/components/ui/CopyButton";
import PaginationBar from "~/src/components/ui/PaginationBar";
import BeergamButton from "~/src/components/utils/BeergamButton";
import {
    getClaimStatus,
    getRoleLabel,
    getStageLabel,
    getTypeLabel,
    getResolutionReasonLabel,
    getClosedByLabel,
    type Claim,
    type ClaimsPagination,
    ClaimStatus,
} from "../typings";
import ClaimsListSkeleton from "./ClaimsListSkeleton";

interface ClaimsListProps {
    claims: Claim[];
    pagination?: ClaimsPagination;
    loading?: boolean;
    onPageChange?: (page: number) => void;
}

function formatDate(value?: string | null): string {
    if (!value) return "—";
    const date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function isHtmlContent(text: string): boolean {
    return /<[a-z][\s\S]*>/i.test(text);
}

function MessageContent({ message }: { message: string }) {
    const isHtml = isHtmlContent(message);

    if (isHtml) {
        return (
            <div
                className="text-beergam-typography-secondary flex-1 min-w-0 **:text-xs **:leading-relaxed [&_strong]:font-semibold [&_strong]:text-beergam-typography-primary [&_p]:mb-1 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:space-y-1 [&_li]:mb-0.5"
                dangerouslySetInnerHTML={{ __html: message }}
            />
        );
    }

    return (
        <p className="text-beergam-typography-secondary line-clamp-2 flex-1 min-w-0">
            {message}
        </p>
    );
}

function ClaimCard({
    claim,
}: {
    claim: Claim;
}) {
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);

    const anuncioQuery = useQuery({
        queryKey: ["anuncio", claim.resource_id],
        queryFn: () => anuncioService.getAnuncioDetails(String(claim.resource_id!)),
        enabled: showDetails && Boolean(claim.resource_id) && claim.resource === "item",
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const anuncio = anuncioQuery.data?.success ? anuncioQuery.data.data : null;
    const claimStatus = getClaimStatus(claim.status);
    const isOpened = claimStatus === ClaimStatus.OPENED;
    // Messages pode ser array ou objeto vazio {}
    const allMessages = Array.isArray(claim.messages) ? claim.messages : [];
    // Limita a exibição das últimas 5 mensagens
    const messages = allMessages.slice(-5);
    const detail = claim.detail;
    const resolution = claim.resolution;
    const affectsReputation = claim.affects_reputation;

    // Determina se afetou reputação
    const reputationStatus = affectsReputation?.affects_reputation || "unknown";
    const reputationLabel =
        reputationStatus === "affected" ? "Afetou Reputação" :
            reputationStatus === "not_affected" ? "Não Afetou Reputação" :
                "—";

    function handleGoToChat() {
        // Redireciona para a página de chat/mensagens com o ID da reclamação
        navigate(`/interno/mensagens?claim_id=${claim.id}`);
    }

    return (
        <Paper className="space-y-4!">
            {/* Cabeçalho da reclamação */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                    {/* IDs em linha - estilo perguntas */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-beergam-typography-secondary!">
                        <span className="break-all">{String(claim.id)}</span>
                        <CopyButton
                            textToCopy={String(claim.id)}
                            successMessage="ID da reclamação copiado para a área de transferência"
                            iconSize="h-3.5 w-3.5"
                            ariaLabel="Copiar ID da reclamação"
                        />
                        {Boolean(claim.buyer_id || claim.buyer_nickname) && (
                            <>
                                <span className="hidden sm:inline">•</span>
                                <span className="break-all">
                                    {claim.buyer_nickname
                                        ? `Usuário ${String(claim.buyer_nickname)}`
                                        : `Usuário ${String(claim.buyer_id)}`}
                                </span>
                                {claim.buyer_id && (
                                    <CopyButton
                                        textToCopy={String(claim.buyer_id)}
                                        successMessage="ID do comprador copiado para a área de transferência"
                                        iconSize="h-3.5 w-3.5"
                                        ariaLabel="Copiar ID do comprador"
                                    />
                                )}
                            </>
                        )}
                    </div>
                    {/* Reason ou título do detail */}
                    <p className="text-sm sm:text-base font-semibold text-beergam-typography-primary! wrap-break-word">
                        {claim.reason || detail?.title || getResolutionReasonLabel(claim.resolution?.reason)}
                    </p>
                    {/* Tags de status e data */}
                    <div className="flex flex-wrap gap-2 text-xs text-beergam-typography-secondary!">
                        <span
                            className={`px-2 py-1 rounded-full border ${isOpened
                                ? "bg-beergam-blue/10 border-beergam-blue/30 text-beergam-blue"
                                : "bg-beergam-green/10 border-beergam-green/30 text-beergam-green"
                                }`}
                        >
                            Status: {isOpened ? "Aberta" : "Fechada"}
                        </span>
                        {/* Badge de reputação */}
                        {reputationStatus !== "unknown" && (
                            <span
                                className={`px-2 py-1 rounded-full border ${reputationStatus === "affected"
                                    ? "bg-beergam-red-light border-beergam-red/30 text-beergam-red-primary"
                                    : "bg-beergam-green/10 border-beergam-green/30 text-beergam-green"
                                    }`}
                            >
                                {reputationLabel}
                            </span>
                        )}
                        <span className="px-2 py-1 rounded-full bg-beergam-typography-tertiary/10 border border-beergam-typography-tertiary/30 text-beergam-typography-tertiary! whitespace-nowrap">
                            Criada: {formatDate(claim.date_created)}
                        </span>
                    </div>
                </div>
                {/* Botão ir para chat - apenas se estiver aberta */}
                {isOpened && (
                    <BeergamButton
                        title="Ir para Chat"
                        mainColor="beergam-orange"
                        animationStyle="slider"
                        onClick={handleGoToChat}
                        className="w-full sm:w-auto sm:shrink-0 px-4"
                    />
                )}
            </div>

            {/* Preview de mensagens - pequeno e discreto */}
            {messages.length > 0 && (
                <div className="relative">
                    <div className="space-y-1.5 max-h-20 overflow-hidden mb-6">
                        {messages.slice(-2).map((msg, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-2 text-xs"
                            >
                                <span className="text-beergam-typography-tertiary font-medium shrink-0 min-w-[60px]">
                                    {getRoleLabel(msg.sender_role) || "Sistema"}:
                                </span>
                                <MessageContent message={msg.message} />
                            </div>
                        ))}
                    </div>
                    {/* Efeito fade no final */}
                    {(messages.length > 1 ||
                        (messages.length === 1 && (messages[0].message?.length ?? 0) > 300)) && (
                            <div
                                className="absolute bottom-11 left-0 right-0 h-7 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(to top, var(--color-beergam-mui-paper) 0%, transparent 100%)'
                                }}
                            />
                        )}
                    {/* Link para ir ao chat */}
                    <button
                        onClick={handleGoToChat}
                        className="relative z-10 text-xs text-beergam-blue hover:text-beergam-blue-primary transition-colors w-full text-left mt-1"
                    >
                        Ver todas as mensagens no chat →
                    </button>
                </div>
            )}

            <BeergamButton
                title="Ver detalhes"
                icon="chevron"
                iconClassName={showDetails ? "rotate-270" : "rotate-90"}
                animationStyle="slider"
                onClick={() => setShowDetails(!showDetails)}
            />

            {/* Detalhes expandidos (acordeon) */}
            {showDetails && (
                <div className="mt-2 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-1 gap-3">
                        {/* Detalhes da reclamação (detail) - quando aberta */}
                        {detail && (detail.title || detail.description || detail.action_responsible || detail.due_date) && (
                            <Paper className="bg-beergam-section-background! space-y-3!">
                                <p className="font-semibold text-beergam-typography-primary! mb-2">
                                    Detalhes da Reclamação
                                </p>
                                {detail.title && (
                                    <div>
                                        <p className="text-sm font-medium text-beergam-typography-primary! mb-1">
                                            {detail.title}
                                        </p>
                                    </div>
                                )}
                                {detail.description && (
                                    <div>
                                        <p className="text-sm text-beergam-typography-secondary! whitespace-pre-wrap">
                                            {detail.description}
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    {detail.action_responsible && (
                                        <div>
                                            <span className="text-beergam-typography-secondary">Responsável: </span>
                                            <span className="text-beergam-typography-primary">
                                                {getRoleLabel(detail.action_responsible)}
                                            </span>
                                        </div>
                                    )}
                                    {detail.due_date && (
                                        <div>
                                            <span className="text-beergam-typography-secondary">Prazo: </span>
                                            <span className="text-beergam-typography-primary">
                                                {formatDate(detail.due_date)}
                                            </span>
                                        </div>
                                    )}
                                    {detail.problem && (
                                        <div className="sm:col-span-2">
                                            <span className="text-beergam-typography-secondary">Problema: </span>
                                            <span className="text-beergam-typography-primary">
                                                {detail.problem}
                                            </span>
                                        </div>
                                    )}
                                    {detail.available !== undefined && (
                                        <div>
                                            <span className="text-beergam-typography-secondary">Disponível: </span>
                                            <span className="text-beergam-typography-primary">
                                                {detail.available ? "Sim" : "Não"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Paper>
                        )}

                        {/* Resolução da reclamação (resolution) - quando fechada */}
                        {resolution && (
                            <Paper className="bg-beergam-section-background! space-y-3!">
                                <p className="font-semibold text-beergam-typography-primary! mb-2">
                                    Resolução da Reclamação
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    {resolution.reason && (
                                        <div className="sm:col-span-2">
                                            <span className="text-beergam-typography-secondary">Motivo da Resolução: </span>
                                            <span className="text-beergam-typography-primary font-medium">
                                                {getResolutionReasonLabel(resolution.reason)}
                                            </span>
                                        </div>
                                    )}
                                    {resolution.date_created && (
                                        <div>
                                            <span className="text-beergam-typography-secondary">Data de Resolução: </span>
                                            <span className="text-beergam-typography-primary">
                                                {formatDate(resolution.date_created)}
                                            </span>
                                        </div>
                                    )}
                                    {resolution.closed_by && (
                                        <div>
                                            <span className="text-beergam-typography-secondary">Encerrada por: </span>
                                            <span className="text-beergam-typography-primary">
                                                {getClosedByLabel(resolution.closed_by)}
                                            </span>
                                        </div>
                                    )}
                                    {resolution.applied_coverage !== undefined && (
                                        <div>
                                            <span className="text-beergam-typography-secondary">Cobertura Aplicada: </span>
                                            <span className="text-beergam-typography-primary">
                                                {resolution.applied_coverage ? "Sim" : "Não"}
                                            </span>
                                        </div>
                                    )}
                                    {resolution.benefited && Array.isArray(resolution.benefited) && resolution.benefited.length > 0 && (
                                        <div className="sm:col-span-2">
                                            <span className="text-beergam-typography-secondary">Beneficiados: </span>
                                            <span className="text-beergam-typography-primary">
                                                {resolution.benefited.map((b) => getRoleLabel(b)).join(", ")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Paper>
                        )}

                        {/* Informações da reclamação */}
                        <Paper className="bg-beergam-section-background! space-y-3!">
                            <p className="font-semibold text-beergam-typography-primary! mb-2">
                                Informações da Reclamação
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {claim.reason_id && (
                                    <div>
                                        <span className="text-beergam-typography-secondary">ID do Motivo: </span>
                                        <span className="text-beergam-typography-primary">
                                            {claim.reason_id}
                                        </span>
                                    </div>
                                )}
                                {claim.stage && (
                                    <div>
                                        <span className="text-beergam-typography-secondary">Estágio: </span>
                                        <span className="text-beergam-typography-primary">
                                            {getStageLabel(claim.stage)}
                                        </span>
                                    </div>
                                )}
                                {claim.type && (
                                    <div>
                                        <span className="text-beergam-typography-secondary">Tipo: </span>
                                        <span className="text-beergam-typography-primary">
                                            {getTypeLabel(claim.type)}
                                        </span>
                                    </div>
                                )}
                                {claim.date_closed && (
                                    <div>
                                        <span className="text-beergam-typography-secondary">Fechada em: </span>
                                        <span className="text-beergam-typography-primary">
                                            {formatDate(claim.date_closed)}
                                        </span>
                                    </div>
                                )}
                                {claim.last_updated && (
                                    <div>
                                        <span className="text-beergam-typography-secondary">Última atualização: </span>
                                        <span className="text-beergam-typography-primary">
                                            {formatDate(claim.last_updated)}
                                        </span>
                                    </div>
                                )}
                                {affectsReputation && (
                                    <div className="sm:col-span-2">
                                        <span className="text-beergam-typography-secondary">Reputação: </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block ${reputationStatus === "affected"
                                                ? "bg-beergam-red-light border border-beergam-red/30 text-beergam-red-primary"
                                                : "bg-beergam-green/10 border border-beergam-green/30 text-beergam-green"
                                                }`}
                                        >
                                            {reputationLabel}
                                        </span>
                                        {affectsReputation.due_date && (
                                            <span className="text-beergam-typography-secondary ml-2">
                                                (Prazo: {formatDate(affectsReputation.due_date)})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Paper>

                        {/* Anúncio (se aplicável) */}
                        {claim.resource === "item" && claim.resource_id && (
                            <Paper className="bg-beergam-section-background! space-y-3!">
                                <p className="font-semibold text-beergam-typography-primary! mb-2">
                                    Anúncio
                                </p>
                                {anuncioQuery.isLoading ? (
                                    <p className="text-xs text-beergam-typography-secondary!">
                                        Carregando...
                                    </p>
                                ) : anuncio ? (
                                    <>
                                        <div className="flex flex-col sm:flex-row gap-3 mb-2">
                                            <Thumbnail thumbnail={anuncio.thumbnail ?? ""} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-beergam-typography-primary! mb-1 wrap-break-word">
                                                    {anuncio.name ?? "—"}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-1.5 text-xs text-beergam-typography-secondary!">
                                                    <span className="break-all">
                                                        MLB: {anuncio.mlb ?? claim.resource_id ?? "—"}
                                                    </span>
                                                    {(anuncio.mlb || claim.resource_id) && (
                                                        <CopyButton
                                                            textToCopy={String(anuncio.mlb ?? claim.resource_id)}
                                                            successMessage="MLB copiado para a área de transferência"
                                                            iconSize="h-3 w-3"
                                                            ariaLabel="Copiar MLB"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-beergam-typography-secondary!">
                                            <p>SKU: {anuncio.sku ?? "—"}</p>
                                            <p>Preço: {anuncio.price ? `R$ ${anuncio.price}` : "—"}</p>
                                            <p>Estoque: {anuncio.stock ?? "—"}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-beergam-typography-secondary!">
                                        Anúncio não encontrado
                                    </p>
                                )}
                            </Paper>
                        )}
                    </div>
                </div>
            )}
        </Paper>
    );
}

export function ClaimsList({
    claims,
    pagination,
    loading,
    onPageChange,
}: ClaimsListProps) {
    const hasPagination = Boolean(
        pagination?.total_pages && pagination.total_pages > 1
    );

    const empty = useMemo(
        () => !loading && claims.length === 0,
        [loading, claims.length]
    );

    return (
        <div className="space-y-3" id="claims-list-top">
            {loading ? <ClaimsListSkeleton /> : null}

            {empty ? (
                <div className="p-6 bg-beergam-section-background border border-dashed border-beergam-section-border rounded-2xl text-center text-beergam-typography-secondary">
                    Nenhuma reclamação encontrada para os filtros atuais.
                </div>
            ) : null}

            {!loading &&
                Array.isArray(claims) &&
                claims.map((claim) => {
                    if (!claim || typeof claim !== "object" || !claim.id) {
                        return null;
                    }
                    return (
                        <ClaimCard
                            key={claim.id}
                            claim={claim}
                        />
                    );
                })}

            {hasPagination && pagination ? (
                <PaginationBar
                    page={pagination.page}
                    totalPages={pagination.total_pages ?? 1}
                    totalCount={pagination.total_count}
                    entityLabel="reclamações"
                    onChange={(nextPage) => {
                        if (!onPageChange) return;
                        onPageChange(nextPage);
                    }}
                    scrollOnChange
                    scrollTargetId="claims-list-top"
                    isLoading={loading}
                />
            ) : null}
        </div>
    );
}
