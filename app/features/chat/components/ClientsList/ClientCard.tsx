import { Chip, Paper } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { memo } from "react";
import { MarketplaceTypeLabel } from "~/features/marketplace/typings";
import { getMarketplaceImageUrl } from "~/src/constants/cdn-images";
import type { Client } from "../../typings";

/** Estilo do Chip por tipo de tag (reclamação/pós-venda aberta ou fechada). */
function getTagChipSx(tag: string): SxProps<Theme> {
    const base = {
        height: 20,
        fontSize: "0.625rem",
        fontWeight: 500,
        "& .MuiChip-label": { px: 1 },
    };
    if (tag === "Reclamação aberta") {
        return { ...base, backgroundColor: "var(--color-beergam-alert-warning-bg)", color: "var(--color-beergam-alert-warning-icon)" };
    }
    if (tag === "Reclamação fechada") {
        return { ...base, backgroundColor: "var(--color-beergam-alert-error-bg)", color: "var(--color-beergam-alert-error-icon)" };
    }
    if (tag === "Pós-venda aberta") {
        return { ...base, backgroundColor: "var(--color-beergam-alert-warning-bg)", color: "var(--color-beergam-alert-warning-icon)" };
    }
    if (tag === "Pós-venda bloqueada") {
        return { ...base, backgroundColor: "var(--color-beergam-alert-error-bg)", color: "var(--color-beergam-alert-error-icon)" };
    }
    return { ...base, backgroundColor: "var(--color-beergam-gray-light)", color: "var(--color-beergam-typography-primary!)" };
}

interface ClientCardProps {
    client: Client;
    selected?: boolean;
    onSelect?: (client: Client) => void;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function ClientCardComponent({
    client,
    selected = false,
    onSelect,
}: ClientCardProps) {
    const marketplaceImageUrl = getMarketplaceImageUrl(client.marketplace_type);
    const marketplaceLabel = MarketplaceTypeLabel[client.marketplace_type];

    const handleClick = () => {
        onSelect?.(client);
    };

    const validTags = (client.tags ?? []).filter((t) => typeof t === "string" && t.trim().length > 0);

    return (
        <Paper
            className={`relative rounded-xl p-4 cursor-pointer transition-all duration-200 border ${selected
                ? "bg-beergam-primary/10! border-beergam-primary! shadow-md"
                : "bg-beergam-section-background! border-transparent! hover:shadow-md hover:border-beergam-primary/30!"
                }`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {/* Tags no canto superior direito */}
            {validTags.length > 0 && (
                <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end max-w-[60%]">
                    {validTags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            className="h-5 text-[10px]"
                            sx={getTagChipSx(tag)}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-start gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-beergam-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-beergam-primary font-semibold text-sm">
                        {client.nickname.charAt(0).toUpperCase()}
                    </span>
                </div>

                <div className={`flex-1 min-w-0 ${validTags.length > 0 ? "pr-20" : ""}`}>
                    {/* Nome e badge do marketplace */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4
                            className={`font-semibold text-sm truncate ${selected
                                ? "text-beergam-primary"
                                : "text-beergam-typography-primary"
                                }`}
                            title={client.nickname}
                        >
                            {client.nickname}
                        </h4>
                        <div className="flex items-center gap-1.5">
                            <img
                                src={marketplaceImageUrl}
                                alt={marketplaceLabel}
                                className="w-4 h-4 object-contain"
                            />
                            <Chip
                                label={marketplaceLabel}
                                size="small"
                                className="h-5 text-[10px] px-1.5"
                                sx={{
                                    height: 20,
                                    fontSize: "0.625rem",
                                    fontWeight: 500,
                                    backgroundColor: "var(--color-beergam-blue-light)",
                                    color: "var(--color-beergam-blue-primary)",
                                    "& .MuiChip-label": {
                                        px: 1,
                                    },
                                }}
                            />
                        </div>
                    </div>

                    {/* Nome do receiver */}
                    <p className="text-xs text-beergam-typography-tertiary! truncate mb-2">
                        {client.receiver_name}
                    </p>

                    {/* Estatísticas */}
                    <div className="flex items-center gap-4 text-xs text-beergam-typography-tertiary!">
                        <span>
                            {client.total_orders} pedido{client.total_orders !== 1 ? "s" : ""}
                        </span>
                        <span className="font-medium text-beergam-primary">
                            {formatCurrency(client.total_spent)}
                        </span>
                    </div>
                </div>
            </div>
        </Paper>
    );
}

const ClientCard = memo(ClientCardComponent, (prevProps, nextProps) => {
    return (
        prevProps.client.client_id === nextProps.client.client_id &&
        prevProps.selected === nextProps.selected &&
        prevProps.onSelect === nextProps.onSelect
    );
});

ClientCard.displayName = "ClientCard";

export default ClientCard;
