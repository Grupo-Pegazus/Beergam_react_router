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
      <div
        ref={tableContainerRef}
        className="rounded-lg border border-gray-200 bg-white"
        style={{
          overflow: 'auto',
          position: 'relative',
          height: `${height}px`,
        }}
      >
        {/* Usamos CSS Grid para permitir alturas dinâmicas nas rows */}
        <table style={{ display: 'grid' }}>
          {/* Header sticky */}
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
            className="bg-gray-100"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: 'flex', width: '100%' }}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      display: 'flex',
                      width: header.getSize(),
                      padding: '8px 12px',
                      fontWeight: 600,
                      fontSize: '12px',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body virtualizado */}
          <tbody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>;
              return (
                <tr
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`,
                    width: '100%',
                  }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: cell.column.getSize(),
                        padding: '8px 12px',
                        fontSize: '12px',
                        borderBottom: '1px solid #f3f4f6',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
