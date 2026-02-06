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
  TableFooter,
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
import React, { memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { Pagination } from '~/features/apiClient/typings';
// Importa a extensão de tipos para meta customizado
import Svg from '~/src/assets/svgs/_index';
import AsyncBoundary from '../ui/AsyncBoundary';
import BeergamButton from '../utils/BeergamButton';
import { TanstackTableSkeleton } from './Skeleton';
import './types';

// Constante para a chave do localStorage
const COLUMN_VISIBILITY_STORAGE_KEY = 'tanstack-table-column-visibility';

/** Carrega visibilidade das colunas do localStorage */
function loadColumnVisibility(storageKey: string | undefined): VisibilityState | null {
  if (!storageKey || typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as Record<string, VisibilityState>;
    return parsed[storageKey] ?? null;
  } catch {
    return null;
  }
}

/** Salva visibilidade das colunas no localStorage */
function saveColumnVisibility(storageKey: string | undefined, visibility: VisibilityState): void {
  if (!storageKey || typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as Record<string, VisibilityState>) : {};
    
    parsed[storageKey] = visibility;
    localStorage.setItem(COLUMN_VISIBILITY_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignora erros de localStorage (quota excedida, etc)
  }
}

/** Props para o componente de context menu */
export interface ContextMenuProps<TData> {
  /** Dados da linha selecionada (objeto original) */
  data: TData;
  /** Posição do clique para posicionar o menu */
  anchorPosition: { top: number; left: number };
  /** Callback para fechar o menu */
  onClose: () => void;
}

/** Ref para controlar o context menu externamente */
interface ContextMenuHandle<TData> {
  open: (data: TData, position: { top: number; left: number }) => void;
  close: () => void;
}

/** Componente isolado para o context menu - evita re-render da tabela */
function ContextMenuControllerInner<TData>(
  { contextMenuComponent, onClose: onCloseCallback }: { 
    contextMenuComponent: (props: ContextMenuProps<TData>) => React.ReactNode;
    onClose?: () => void;
  },
  ref: React.ForwardedRef<ContextMenuHandle<TData>>
) {
  const [contextMenu, setContextMenu] = useState<{
    data: TData;
    position: { top: number; left: number };
  } | null>(null);

  const handleClose = useCallback(() => {
    setContextMenu(null);
    onCloseCallback?.();
  }, [onCloseCallback]);

  useImperativeHandle(ref, () => ({
    open: (data: TData, position: { top: number; left: number }) => {
      setContextMenu({ data, position });
    },
    close: handleClose,
  }), [handleClose]);

  if (!contextMenu) return null;

  return (
    <>
      {contextMenuComponent({
        data: contextMenu.data,
        anchorPosition: contextMenu.position,
        onClose: handleClose,
      })}
    </>
  );
}

// Forward ref com tipagem genérica
const ContextMenuControllerWithRef = React.forwardRef(ContextMenuControllerInner) as <TData>(
  props: { 
    contextMenuComponent: (props: ContextMenuProps<TData>) => React.ReactNode; 
    onClose?: () => void;
    ref?: React.Ref<ContextMenuHandle<TData>>;
  }
) => React.ReactElement | null;

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
    <>
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
    </>
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
  /** Componente de context menu que aparece ao clicar com botão direito na linha */
  contextMenuComponent?: (props: ContextMenuProps<TData>) => React.ReactNode;
  /** Componentes adicionais para serem exibidos na tabela */
  additionalControls?: React.ReactNode[];
  /** Indica se está carregando a tabela (default: false) */
  isLoading?: boolean;
  /** Erro ao carregar a tabela (default: undefined) */
  error?: unknown;
  /** Chave única para salvar configurações de visibilidade no localStorage (ex: 'orders', 'products') */
  storageKey?: string;
  /** Indica se está exportando para Excel (default: false) */
  exportToExcel?: boolean;
}

export default function TanstackTable<TData>({
  isLoading = false,
  error,
  data,
  columns,
  height: heightProp,
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
  contextMenuComponent,
  additionalControls,
  storageKey,
  exportToExcel = false,
}: TanstackTableProps<TData>) {
  // Calcula altura como 60% da tela se não for passada como prop
  const [screenHeight, setScreenHeight] = useState(() => 
    typeof window !== 'undefined' ? Math.floor(window.innerHeight * 0.62) : 600
  );
  
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(Math.floor(window.innerHeight * 0.62));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const height = heightProp ?? screenHeight;

  // Debug: contador de renders
  const renderCount = useRef(0);
  renderCount.current++;

  // Estado de sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // Carrega visibilidade inicial do localStorage ou usa padrão (todas visíveis)
  const initialColumnVisibility = useMemo(() => {
    const stored = loadColumnVisibility(storageKey);
    if (stored) return stored;
    
    // Se não houver nada salvo, retorna objeto vazio (todas as colunas visíveis por padrão)
    return {};
  }, [storageKey]);
  
  // Estado de visibilidade das colunas
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
  
  // Salva no localStorage quando a visibilidade muda
  useEffect(() => {
    if (storageKey && Object.keys(columnVisibility).length > 0) {
      saveColumnVisibility(storageKey, columnVisibility);
    }
  }, [storageKey, columnVisibility]);
  
  // Ref para o context menu controller (evita re-render da tabela)
  const contextMenuRef = useRef<ContextMenuHandle<TData>>(null);
  
  // ID da linha selecionada pelo context menu (para destacar visualmente)
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  
  // Handler do context menu usando ref - não causa re-render da tabela
  const handleContextMenu = useCallback((event: React.MouseEvent, row: Row<TData>) => {
    event.preventDefault();
    setSelectedRowId(row.id);
    contextMenuRef.current?.open(row.original, { top: event.clientY, left: event.clientX });
  }, []);
  
  // Callback para quando o context menu fecha
  const handleCloseContextMenu = useCallback(() => {
    setSelectedRowId(null);
  }, []);

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

  // Verifica se há alguma coluna com footerValue definido
  const hasFooter = useMemo(() => {
    return table.getAllLeafColumns().some(col => col.columnDef.meta?.footerValue !== undefined);
  }, [table]);

  return (
    <div className="tanstack-table-wrapper">
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <>
        <p className="text-xs text-gray-500 mb-2 hidden">
          🔍 Render #{renderCount.current} | Total: {data.length} rows | Virtual: {virtualRows.length} rows
        </p>
        </>
      )}
      
      {/* Controle de visibilidade de colunas (componente isolado para evitar re-render) */}
      <div className="flex items-center justify-end gap-4 mb-2">
      {additionalControls && Array.isArray(additionalControls) && <>{additionalControls.map((control) => control)}</>}
      {controlColumns && <ColumnVisibilityControl table={table} columnVisibility={columnVisibility} />}
      </div>
      {/* Container scrollável */}
<AsyncBoundary isLoading={isLoading} error={error as unknown} Skeleton={() => <TanstackTableSkeleton rows={15} columns={15} />} ErrorFallback={() => <p>erro ao carregar a tabela</p>}>
        {/* Placeholder quando não há dados - renderizado fora da tabela */}
        {rows.length === 0 ? (
          <Paper
          className="mb-2!"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: `${height}px`,
              borderRadius: 2,
              bgcolor: 'var(--color-beergam-section-background)',
            }}
          >
            <Svg.in_box_stack width={56} height={56} tailWindClasses="text-beergam-typography-primary mb-2" />
            <Typography variant="body1" fontWeight={500} sx={{ color: 'var(--color-beergam-typography-primary)' }}>
              Nenhum item encontrado
            </Typography>
            <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.6, color: 'var(--color-beergam-typography-tertiary)' }}>
              Tente ajustar os filtros ou realizar uma nova busca
            </Typography>
          </Paper>
        ) : (
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
              const isSelected = selectedRowId === row.id;
              return (
                <TableRow
                  key={row.id}
                  data-index={virtualRow.index}
                  data-selected={isSelected}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  onContextMenu={contextMenuComponent ? (e) => handleContextMenu(e, row) : undefined}
                  sx={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`,
                    width: '100%',
                    transition: 'background-color 0.15s, box-shadow 0.15s',
                    cursor: contextMenuComponent ? 'context-menu' : 'default',
                    // Estilo para linha selecionada pelo context menu
                    ...(isSelected && {
                      zIndex: 1,
                      boxShadow: 'inset 0 0 0 2px var(--color-beergam-primary)',
                      '& td, & .MuiTableCell-root': {
                        bgcolor: 'var(--color-beergam-white) !important',
                      },
                    }),
                    '&:hover': {
                      // Faz todas as cells ficarem transparentes no hover
                      '& td, & .MuiTableCell-root': {
                        bgcolor: isSelected ? 'var(--color-beergam-white) !important' : 'var(--color-beergam-white) !important',
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
                        color: cell.column.columnDef.meta?.textColor || "var(--color-beergam-gray-blueish-dark)",
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

          {/* Footer row - linha adicional com valores customizados por coluna */}
          {hasFooter && (
            <TableFooter
              sx={{
                display: 'grid',
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
                bgcolor: 'grey.200',
              }}
            >
              <TableRow sx={{ display: 'flex', width: '100%' }}>
                {table.getVisibleLeafColumns().map((column) => {
                  const footerValue = column.columnDef.meta?.footerValue;
                  const hasValue = footerValue !== undefined && footerValue !== null && footerValue !== '';
                  const footerColor = column.columnDef.meta?.footerColor 
                    ?? column.columnDef.meta?.headerColor 
                    ?? 'grey.200';
                  
                  return (
                    <TableCell
                      key={column.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: column.getSize(),
                        fontWeight: 600,
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        color: column.columnDef.meta?.textColor || "var(--color-beergam-gray-blueish-dark)",
                        bgcolor: hasValue ? footerColor : '#e2e8f0',
                        borderRight: hasValue ? '1px solid rgba(0,0,0,0.08)' : 'none',
                        borderTop: hasValue ? '2px solid rgba(0,0,0,0.12)' : 'none',
                      }}
                    >
                      {footerValue ?? ''}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          )}
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
        )}

<p className="text-xs text-gray-500 mb-2">
  {rows.length} de {pagination.total_count} items encontrados.
</p>
</AsyncBoundary>

      {/* Context Menu Controller (isolado para evitar re-render da tabela) */}
      {contextMenuComponent && (
        <ContextMenuControllerWithRef
          ref={contextMenuRef}
          contextMenuComponent={contextMenuComponent}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
}


