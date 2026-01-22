import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { ColumnDef, Row, SortingState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef, useState } from 'react';

// Importa a extensão de tipos para meta customizado
import Svg from '~/src/assets/svgs/_index';
import './types';


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
}

export default function TanstackTable<TData>({
  data,
  columns,
  height = 400,
  estimateRowHeight = 35,
  overscan = 5,
  minColumnWidth = 80,
  maxColumnWidth = 300,
}: TanstackTableProps<TData>) {
  // Debug: contador de renders
  const renderCount = useRef(0);
  renderCount.current++;

  // Estado de sorting
  const [sorting, setSorting] = useState<SortingState>([]);

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

  // Configurar TanStack Table com sorting
  const table = useReactTable({
    data,
    columns: columnsWithSize,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
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
      </TableContainer>
    </div>
  );
}
