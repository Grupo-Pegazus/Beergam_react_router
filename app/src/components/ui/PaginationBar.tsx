import { useEffect, useRef } from "react";
import { Pagination, Stack, Typography } from "@mui/material";

type PaginationBarBaseProps = {
  page: number;
  totalPages: number;
  totalCount?: number;
  /**
   * Texto base para o tipo de item, ex: "produtos", "pedidos", "categorias".
   * Usado na mensagem padrão de resumo.
   */
  entityLabel?: string;
  /**
   * Callback disparado ao trocar de página.
   */
  onChange: (nextPage: number) => void;
  /**
   * Permite customizar totalmente o texto de resumo.
   * Se informado, a mensagem padrão é ignorada.
   */
  renderSummaryText?: (info: {
    page: number;
    totalPages: number;
    totalCount?: number;
    entityLabel?: string;
  }) => React.ReactNode;
  /**
   * Classe Tailwind adicional aplicada ao wrapper da barra.
   */
  className?: string;
  /**
   * Indica se a lista associada está carregando.
   * Usado para disparar o scroll apenas após o carregamento.
   */
  isLoading?: boolean;
};

type PaginationBarPropsWithoutScroll = PaginationBarBaseProps & {
  scrollOnChange?: false;
  scrollTargetId?: never;
};

type PaginationBarPropsWithScroll = PaginationBarBaseProps & {
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
    // Marca a página para a qual devemos rolar assim que os dados forem carregados/renderizados
    pendingScrollPageRef.current = nextPage;
    onChange(nextPage);
  };

  // Efeito responsável por fazer o scroll após o carregamento dos dados / mudança de página
  useEffect(() => {
    if (!scrollOnChange) {
      pendingScrollPageRef.current = null;
      return;
    }

    // Enquanto estiver carregando, aguardamos o próximo ciclo
    if (isLoading) {
      return;
    }

    // Só rola quando:
    // - existe uma página pendente para scroll
    // - e essa página corresponde à página atualmente renderizada
    if (pendingScrollPageRef.current === null) return;
    if (pendingScrollPageRef.current !== page) return;

    // Consumimos a página pendente
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

  // Se só existe uma página, não renderiza a barra de paginação
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
