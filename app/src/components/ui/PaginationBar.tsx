import { useEffect, useRef } from "react";
import { Pagination, Stack, Typography } from "@mui/material";

type PaginationBarBaseProps = {
  page: number;
  totalPages: number;
  totalCount?: number;
  /**
   * Indica se deve ser exibido o texto de resumo.
   * @default true
   */
  showEntity?: boolean;
  /**
   * Texto base para o tipo de item, ex: "produtos", "pedidos", "categorias". Usado na mensagem padrão de resumo.
   */
  entityLabel?: string;
  /**
   * Callback disparado ao trocar de página. Se o scrollOnChange for true, o scroll será feito automaticamente.
   */
  onChange: (nextPage: number) => void;
  /**
   * Permite customizar totalmente o texto de resumo. Se informado, a mensagem padrão é ignorada.
   */
  renderSummaryText?: (info: {
    page: number;
    totalPages: number;
    totalCount?: number;
    entityLabel?: string;
  }) => React.ReactNode;
  /**
   * Classe Tailwind adicional aplicada ao wrapper da barra.
   * @default "pt-2"
   */
  className?: string;
  /**
   * Indica se a lista associada está carregando. Usado para disparar o scroll apenas após o carregamento.
   * @default false
   */
  isLoading?: boolean;
};

type PaginationBarPropsWithoutScroll = PaginationBarBaseProps & {
  /**
   * @default false
   */
  scrollOnChange?: false;
  scrollTargetId?: never;
};

type PaginationBarPropsWithScroll = PaginationBarBaseProps & {
  /**
   * @default true
   */
  scrollOnChange: true;
  scrollTargetId: string;
};

type PaginationBarProps = PaginationBarPropsWithoutScroll | PaginationBarPropsWithScroll;

export default function PaginationBar({
  page,
  totalPages,
  totalCount,
  showEntity = true,
  entityLabel,
  onChange,
  scrollOnChange = false,
  scrollTargetId,
  renderSummaryText,
  className,
  isLoading,
}: PaginationBarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollPageRef = useRef<number | null>(null);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    nextPage: number
  ) => {
    if (nextPage === page) return;
    pendingScrollPageRef.current = nextPage;
    onChange(nextPage);
  };

  useEffect(() => {
    if (!scrollOnChange) {
      pendingScrollPageRef.current = null;
      return;
    }

    if (isLoading) {
      return;
    }

    if (pendingScrollPageRef.current === null) return;
    if (pendingScrollPageRef.current !== page) return;

    pendingScrollPageRef.current = null;

    if (typeof window === "undefined") return;

    window.requestAnimationFrame(() => {
      let targetElement: HTMLElement | null = null;

      if (scrollTargetId) {
        targetElement = document.getElementById(scrollTargetId);
      }

      if (!targetElement && containerRef.current) {
        targetElement = containerRef.current;
      }

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }, [page, scrollOnChange, scrollTargetId, isLoading]);

  if (totalPages <= 1) {
    return null;
  }

  const defaultSummary = (
    <Typography
      variant="body2"
      className="text-xs sm:text-sm text-center sm:text-left font-medium"
      sx={{
        color: "var(--color-beergam-gray)",
        fontFamily: "var(--default-font-family), sans-serif",
        letterSpacing: "0.01em",
      }}
    >
      {`Mostrando página ${page} de ${totalPages}`}
      {typeof totalCount === "number" && totalCount >= 0
        ? ` — ${totalCount} ${entityLabel ?? "itens"} no total`
        : null}
    </Typography>
  );

  const summaryContent = renderSummaryText
    ? renderSummaryText({ page, totalPages, totalCount, entityLabel })
    : defaultSummary;

  return (
    <Stack
      ref={containerRef}
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 0 }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", sm: "center" }}
      sx={{ pt: 2 }}
      className={className}
    >
      {showEntity && summaryContent}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        shape="rounded"
        color="primary"
        size="small"
        sx={{
          "& .MuiPagination-ul": {
            justifyContent: "center",
            gap: "4px",
          },
          "& .MuiPaginationItem-root": {
            fontFamily: "var(--default-font-family), sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-beergam-blue-primary)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            minWidth: "36px",
            height: "36px",
            margin: "0 2px",
            transition: "all 0.3s ease",
            backgroundColor: "var(--color-beergam-white)",
            "&:hover": {
              backgroundColor: "var(--color-beergam-blue-light)",
              borderColor: "var(--color-beergam-blue)",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 8px rgba(70, 121, 243, 0.2)",
            },
            "&.Mui-selected": {
              backgroundColor: "var(--color-beergam-orange)",
              color: "var(--color-beergam-white)",
              borderColor: "var(--color-beergam-orange)",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(255, 138, 0, 0.3)",
              "&:hover": {
                backgroundColor: "var(--color-beergam-orange-dark)",
                borderColor: "var(--color-beergam-orange-dark)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(255, 138, 0, 0.4)",
              },
            },
            "&.Mui-disabled": {
              opacity: 0.4,
              cursor: "not-allowed",
              "&:hover": {
                transform: "none",
                boxShadow: "none",
              },
            },
          },
          "& .MuiPaginationItem-icon": {
            fontSize: "1.25rem",
            color: "var(--color-beergam-blue-primary)",
            transition: "color 0.3s ease",
          },
          "& .MuiPaginationItem-root:hover .MuiPaginationItem-icon": {
            color: "var(--color-beergam-blue)",
          },
          "& .MuiPaginationItem-root.Mui-selected .MuiPaginationItem-icon": {
            color: "var(--color-beergam-white)",
          },
        }}
      />
    </Stack>
  );
}
