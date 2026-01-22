import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { ColumnDef, Row } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface TanstackTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  /** Altura do container scrollável (default: 400px) */
  height?: number;
  /** Altura estimada de cada row para cálculo do scroll (default: 35px) */
  estimateRowHeight?: number;
  /** Quantidade de rows extras renderizadas fora da viewport (default: 5) */
  overscan?: number;
}

export default function TanstackTable<TData>({
  data,
  columns,
  height = 400,
  estimateRowHeight = 35,
  overscan = 5,
}: TanstackTableProps<TData>) {
  // Debug: contador de renders
  const renderCount = useRef(0);
  renderCount.current++;

  // Ref para o container scrollável
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Configurar TanStack Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
        <p className="text-xs text-gray-500 mb-2">
          🔍 Render #{renderCount.current} | Total: {data.length} rows | Virtual: {virtualRows.length} rows
        </p>
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
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    component="th"
                    sx={{
                      display: 'flex',
                      width: header.getSize(),
                      fontWeight: 600,
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      bgcolor: 'grey.50',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
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
                    '&:hover': {
                      bgcolor: 'grey.50',
                    },
                    transition: 'background-color 0.15s',
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
