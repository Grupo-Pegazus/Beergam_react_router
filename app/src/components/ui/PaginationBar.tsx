import { useEffect, useRef } from "react";
import { Pagination, Stack, Typography } from "@mui/material";

type PaginationBarBaseProps = {
  page: number;
  totalPages: number;
  totalCount?: number;
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
      color="text.secondary"
      className="text-xs sm:text-sm text-center sm:text-left"
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
      {summaryContent}
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
          },
        }}
      />
    </Stack>
  );
}
