import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ColumnDef, Row, SortingState, Table as TableType, VisibilityState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { memo, useMemo, useRef, useState } from 'react';
import type { Pagination } from '~/features/apiClient/typings';
// Importa a extensão de tipos para meta customizado
import Svg from '~/src/assets/svgs/_index';
import BeergamButton from '../utils/BeergamButton';
import './types';

/** Componente isolado para controle de visibilidade de colunas - evita re-render da tabela */
const ColumnVisibilityControl = memo(function ColumnVisibilityControl<TData>({
  table,
  columnVisibility: _columnVisibility, // usado apenas para trigger de re-render
}: {
  table: TableType<TData>;
  columnVisibility: VisibilityState;
}) {
  // _columnVisibility é usado apenas para forçar re-render quando a visibilidade muda
  void _columnVisibility;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // Agrupa colunas por seção
  const columnsBySection = useMemo(() => {
    const allColumns = table.getAllLeafColumns();
    const sections = new Map<string, typeof allColumns>();

    for (const column of allColumns) {
      const sectionName = column.columnDef.meta?.sectionName || 'Outros';
      if (!sections.has(sectionName)) {
        sections.set(sectionName, []);
      }
      sections.get(sectionName)!.push(column);
    }

    return sections;
  }, [table]);

  return (
    <div className="flex items-center justify-end gap-4 mb-2">
      <BeergamButton
        title="Visualização de Colunas"
        icon="list_bullet"
        onClick={handleOpenPopover}
      />

      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'var(--color-beergam-section-background)',
              maxHeight: 400,
              minWidth: 800,
              maxWidth: 800,
              p: 2,
              overflow: 'auto',
            },
          },
        }}
      >
        {/* Header do popover */}
        <Box sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'space-between', mb: 2, gap: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Colunas Visíveis
          </Typography>
          <div className="max-w-48">
            <BeergamButton
              title="Mostrar todas"
              icon="eye"
              onClick={() => table.toggleAllColumnsVisible(true)}
            />
          </div>
        </Box>

        {/* Lista de colunas agrupadas por seção - 3 itens por linha */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from(columnsBySection.entries()).map(([sectionName, sectionColumns]) => (
            <Box key={sectionName} sx={{ minWidth: 0 }}>
              <Typography
                variant="caption"
                fontWeight={600}
                className="text-beergam-typography-secondary"
                sx={{
                  display: 'block',
                  mb: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {sectionName}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
                {sectionColumns.map((column) => {
                  const headerText = typeof column.columnDef.header === 'string'
                    ? column.columnDef.header
                    : column.id;

                  return (
                    <FormControlLabel
                      key={column.id}
                      control={
                        <Checkbox
                          size="small"
                          checked={column.getIsVisible()}
                          checkedIcon={<Svg.check_circle tailWindClasses="text-beergam-primary" width={20} height={20} />}
                          icon={<Svg.minus_circle tailWindClasses="text-beergam-red" width={20} height={20} />}
                          onChange={column.getToggleVisibilityHandler()}
                          sx={{ color: 'white', '& .MuiSvgIcon-root': { fill: 'var(--color-beergam-primary)' } }}
                        />
                      }
                      label={
                        <Typography variant="body2" fontSize={12}>
                          {headerText}
                        </Typography>
                      }
                      sx={{
                        m: 0,
                        py: 0.25,
                      }}
                      className="hover:bg-beergam-primary/10"
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </div>
      </Popover>
    </div>
  );
}) as <TData>(props: { table: TableType<TData>; columnVisibility: VisibilityState }) => React.ReactElement;

/** Calcula o tamanho da coluna baseado no texto do header */
function calculateColumnWidth(headerText: string, minWidth = 80, maxWidth = 300, canSort = false): number {
  // ~8px por caractere (font 12px) + 32px de padding (16px cada lado)
  const charWidth = 8;
  const padding = 32;
  const calculated = headerText.length * charWidth + padding + (canSort ? 30 : 0);
  return Math.min(Math.max(calculated, minWidth), maxWidth);
}

interface TanstackTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  /** Altura do container scrollável (default: 400px) */
  height?: number;
  /** Altura estimada de cada row para cálculo do scroll (default: 35px) */
  estimateRowHeight?: number;
  /** Quantidade de rows extras renderizadas fora da viewport (default: 5) */
  overscan?: number;
  /** Largura mínima das colunas (default: 80px) */
  minColumnWidth?: number;
  /** Largura máxima das colunas (default: 300px) */
  maxColumnWidth?: number;
  /** Habilita botão para controlar visibilidade das colunas (default: false) */
  controlColumns?: boolean;
  /** Total de items encontrados na busca do backend (default: 0) */
  pagination?: Pagination;
  /** Função para carregar mais items (default: undefined) */
  onLoadMore?: () => void;
  /** Indica se está carregando mais items (default: false) */
  isLoadingMore?: boolean;
}

export default function TanstackTable<TData>({
  data,
  columns,
  height = 400,
  estimateRowHeight = 35,
  overscan = 5,
  minColumnWidth = 80,
  maxColumnWidth = 300,
  controlColumns = false,
  pagination = {
    page: 1,
    per_page: 100,
    total_count: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  },
  onLoadMore,
  isLoadingMore = false,
}: TanstackTableProps<TData>) {
  // Debug: contador de renders
  const renderCount = useRef(0);
  renderCount.current++;

  // Estado de sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Estado de visibilidade das colunas
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Ref para o container scrollável
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Processa as colunas para calcular o tamanho e configurar sorting
  const columnsWithSize = useMemo(() => {
    return columns.map((col) => {
      // Calcula o tamanho
      let size = col.size;
      if (!size) {
        const customWidth = col.meta?.customWidth;
        if (customWidth) {
          size = customWidth;
        } else {
          const headerText = typeof col.header === 'string' 
            ? col.header 
            : String(col.header || col.id || '');
          size = calculateColumnWidth(headerText, minColumnWidth, maxColumnWidth, col.meta?.enableSorting ?? false);
        }
      }
      
      // Configura enableSorting baseado no meta (default: false)
      const enableSorting = col.meta?.enableSorting ?? false;
      
      return {
        ...col,
        size,
        enableSorting,
      };
    });
  }, [columns, minColumnWidth, maxColumnWidth]);

  // Configurar TanStack Table com sorting e visibilidade
  const table = useReactTable({
    data,
    columns: columnsWithSize,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: process.env.NODE_ENV === 'development',
  });

  const { rows } = table.getRowModel();

  // Configurar virtualização
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => estimateRowHeight,
    getScrollElement: () => tableContainerRef.current,
    // Medir altura dinâmica das rows (exceto Firefox que tem bug com border)
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  return (
    <div className="tanstack-table-wrapper">
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <>
        <p className="text-xs text-gray-500 mb-2">
          🔍 Render #{renderCount.current} | Total: {data.length} rows | Virtual: {virtualRows.length} rows
        </p>
        </>
      )}
      
      {/* Controle de visibilidade de colunas (componente isolado para evitar re-render) */}
      {controlColumns && <ColumnVisibilityControl table={table} columnVisibility={columnVisibility} />}
      
      {/* Container scrollável */}
      <TableContainer
        component={Paper}
        ref={tableContainerRef}
        sx={{
          overflow: 'auto',
          position: 'relative',
          height: `${height}px`,
          borderRadius: 2,
          padding: 0,
          display: 'inline-block',
        }}
      >
        {/* Usamos CSS Grid para permitir alturas dinâmicas nas rows */}
        <Table sx={{ display: 'grid' }}>
          {/* Header sticky */}
          <TableHead
            sx={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'grey.100',
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                sx={{ display: 'flex', width: '100%' }}
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  
    return (
                    <TableCell
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 0.5,
                        width: header.getSize(),
                        fontWeight: 600,
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        color: "var(--color-beergam-gray-blueish-dark)",
                        bgcolor: header.column.columnDef.meta?.headerColor || 'grey.100',
                        borderRight: '1px solid rgba(0,0,0,0.08)',
                        cursor: canSort ? 'pointer' : 'default',
                        userSelect: canSort ? 'none' : 'auto',
                        '&:hover': canSort ? {
                          bgcolor: 'rgba(0,0,0,0.08)',
                        } : {},
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </Box>
                      {/* Ícone de sorting */}
                      {canSort && (
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                          {isSorted === 'asc' ? (
                            <Svg.chevron tailWindClasses="rotate-270" width={20} height={20} />
                          ) : isSorted === 'desc' ? (
                            <Svg.chevron tailWindClasses="rotate-90" width={20} height={20} />
                          ) : (
                            <Svg.chevron_up_and_down width={24} height={24} />
                          )}
                        </Box>
                      )}
            </TableCell>
                  );
                })}
        </TableRow>
      ))}
    </TableHead>

          {/* Body virtualizado */}
          <TableBody
            sx={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>;
              return (
                <TableRow
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`,
                    width: '100%',
                    transition: 'background-color 0.15s',
                    '&:hover': {
                      // Faz todas as cells ficarem transparentes no hover
                      '& td, & .MuiTableCell-root': {
                        bgcolor: 'var(--color-beergam-white) !important',
                      },
                    },
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: cell.column.getSize(),
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: "var(--color-beergam-gray-blueish-dark)",
                        bgcolor: cell.column.columnDef.meta?.bodyColor || 'transparent',
                        borderRight: '1px solid rgba(0,0,0,0.04)',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
            </TableCell>
          ))}
        </TableRow>
              );
            })}
    </TableBody>
  </Table>
  {pagination.has_next && onLoadMore && (
    <div className='flex bg-beergam-white sticky left-0 justify-center items-center p-4 w-full'>
      <BeergamButton 
        className='w-[100%]! mt-0!' 
        title={isLoadingMore ? "Carregando..." : "Carregar mais"} 
        icon="arrow_path" 
        onClick={onLoadMore}
        loading={isLoadingMore}
        disabled={isLoadingMore}
      />
    </div>
  )}
      </TableContainer>

<p className="text-xs text-gray-500 mb-2">
  {rows.length} de {pagination.total_count} items encontrados.
</p>
    </div>
  );
}
