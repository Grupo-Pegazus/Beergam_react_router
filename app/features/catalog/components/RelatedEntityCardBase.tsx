import { useState, type ReactNode } from "react";
import { Box, Chip, Collapse, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";

interface RelatedItem {
  id: string;
  title: string;
  sku?: string | null;
  extraTag?: string; // ex: "[Variação]"
}

interface RelatedEntityCardBaseProps {
  /** Texto principal (nome da categoria/atributo) */
  title: string;
  /** Letra exibida no círculo central */
  circleLabel: string;
  /** Classe Tailwind da cor do círculo (ex: bg-beergam-blue-primary) */
  circleBgClass: string;
  /** Descrição opcional abaixo do título */
  description?: string | null;

  /** Indica se existem itens relacionados */
  hasRelated: boolean;
  /** Texto do badge de contagem (ex: "2 produto(s)") */
  badgeLabel: string;

  /** Está expandido? Controlado pelo componente pai */
  isExpanded?: boolean;
  /** Callback para alternar expansão */
  onToggleExpand?: () => void;

  /** Título da seção de relacionados (ex: "Produtos Relacionados") */
  relatedSectionTitle: string;
  /** Lista de itens relacionados para exibir na expansão */
  relatedItems: RelatedItem[];
  /** Quantos itens adicionais existem além dos exibidos (para a mensagem "... e mais X") */
  remainingCount?: number;
  /** Label do sufixo de "mais" (ex: "produto(s)" ou "produto(s)/variação(ões)") */
  remainingSuffix?: string;

  /** Conteúdo extra específico da entidade no header (ex: allowed_values de atributo) */
  extraHeaderContent?: ReactNode;

  /** Handlers de menu */
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function RelatedEntityCardBase({
  title,
  circleLabel,
  circleBgClass,
  description,
  hasRelated,
  badgeLabel,
  isExpanded = false,
  onToggleExpand,
  relatedSectionTitle,
  relatedItems,
  remainingCount,
  remainingSuffix,
  extraHeaderContent,
  onEdit,
  onDelete,
  canDelete,
}: RelatedEntityCardBaseProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    onEdit();
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    onDelete();
    handleMenuClose();
  };

  const handleToggleClick = () => {
    onToggleExpand?.();
  };

  return (
    <>
      <MainCards className="transition-all duration-300 hover:shadow-md">
        <div className={`p-6 ${!isExpanded ? "min-h-[260px]" : ""}`}>
          {/* Header sempre visível */}
          <div className="flex flex-col items-center justify-center relative">
            {/* Menu de ações */}
            <div className="absolute top-0 right-0">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                className="text-beergam-blue-primary"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  },
                }}
              >
                <Svg.elipsis_horizontal tailWindClasses="w-5 h-5" />
              </IconButton>
            </div>

            {/* Ícone circular */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${circleBgClass}`}>
              <span className="text-white font-bold text-2xl">
                {circleLabel.toUpperCase()}
              </span>
            </div>

            {/* Título */}
            <Typography
              variant="h6"
              className="font-semibold text-beergam-blue-primary text-center mb-2"
            >
              {title}
            </Typography>

            {/* Descrição opcional */}
            {description && (
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-center mb-3 text-sm"
              >
                {description}
              </Typography>
            )}

            {/* Conteúdo extra específico (ex: valores permitidos) */}
            {extraHeaderContent}

            {/* Badge de quantidade e botão de expansão */}
            {hasRelated && (
              <div className="flex flex-col items-center gap-2 mt-2">
                <Chip
                  label={badgeLabel}
                  size="small"
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                  }}
                />
                <BeergamButton
                  title={`${isExpanded ? "Ocultar" : "Ver"} produtos`}
                  mainColor="beergam-blue-primary"
                  animationStyle="fade"
                  onClick={handleToggleClick}
                  className="text-xs mt-1 flex items-center gap-1"
                />
              </div>
            )}

            {!hasRelated && (
              <Typography variant="caption" color="text.secondary" className="mt-2">
                Nenhum produto relacionado
              </Typography>
            )}
          </div>

          {/* Seção expandível com produtos relacionados */}
          <Collapse in={isExpanded} timeout={300}>
            {hasRelated && (
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Typography
                  variant="subtitle2"
                  className="font-semibold mb-3 text-gray-700 text-sm"
                >
                  {relatedSectionTitle}
                </Typography>
                <Box
                  sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#cbd5e1",
                      borderRadius: "10px",
                      "&:hover": {
                        background: "#94a3b8",
                      },
                    },
                  }}
                >
                  <div className="space-y-2 pr-2">
                    {relatedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-beergam-blue-primary mt-2 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-900 text-sm"
                          >
                            {item.title}
                            {item.extraTag && (
                              <span className="text-xs text-gray-500 ml-2">
                                {item.extraTag}
                              </span>
                            )}
                          </Typography>
                          {item.sku && (
                            <Typography
                              variant="caption"
                              className="text-gray-500 text-xs"
                            >
                              SKU: {item.sku}
                            </Typography>
                          )}
                        </div>
                      </div>
                    ))}
                    {remainingCount && remainingCount > 0 && (
                      <Typography
                        variant="caption"
                        className="text-gray-500 italic text-center block mt-2 text-xs"
                      >
                        ... e mais {remainingCount} {remainingSuffix ?? "produto(s)"}
                      </Typography>
                    )}
                  </div>
                </Box>
              </Box>
            )}
          </Collapse>
        </div>
      </MainCards>

      {/* Menu comum (editar/excluir) */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditClick}>
          <Svg.pencil tailWindClasses="w-4 h-4 mr-2" />
          Editar
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          disabled={!canDelete}
          sx={{
            color: canDelete ? "error.main" : "text.disabled",
          }}
        >
          <Svg.trash tailWindClasses="w-4 h-4 mr-2" />
          Excluir
        </MenuItem>
      </Menu>
    </>
  );
}


