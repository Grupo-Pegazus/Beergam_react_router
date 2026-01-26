import {
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

interface TanstackTableSkeletonProps {
  /** Número de linhas a exibir (default: 10) */
  rows?: number;
  /** Número de colunas a exibir (default: 8) */
  columns?: number;
  /** Altura do container (default: 400px) */
  height?: number;
  /** Mostrar botão de controle de colunas (default: false) */
  showControlColumns?: boolean;
}

/** Skeleton de loading para a TanstackTable */
export function TanstackTableSkeleton({
  rows = 10,
  columns = 8,
  height = 400,
  showControlColumns = false,
}: TanstackTableSkeletonProps) {
  // Gera larguras variadas para parecer mais natural
  const columnWidths = Array.from({ length: columns }, (_, i) => {
    const baseWidths = [120, 150, 100, 180, 130, 90, 160, 140];
    return baseWidths[i % baseWidths.length];
  });

  return (
    <div className="tanstack-table-wrapper">
      {/* Skeleton do controle de colunas */}
      {showControlColumns && (
        <div className="flex items-center justify-end gap-4 mb-2">
          <Skeleton 
            variant="rounded" 
            width={180} 
            height={36} 
            sx={{ bgcolor: 'grey.200' }}
          />
        </div>
      )}

      {/* Container da tabela */}
      <TableContainer
        component={Paper}
        sx={{
          overflow: 'hidden',
          position: 'relative',
          height: `${height}px`,
          borderRadius: 2,
          padding: 0,
        }}
      >
        <Table sx={{ display: 'grid' }}>
          {/* Header */}
          <TableHead
            sx={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'grey.100',
            }}
          >
            <TableRow sx={{ display: 'flex', width: '100%' }}>
              {columnWidths.map((width, index) => (
                <TableCell
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: width,
                    fontWeight: 600,
                    fontSize: '12px',
                    bgcolor: 'grey.100',
                    borderRight: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Skeleton 
                    variant="text" 
                    width={width - 32} 
                    height={20}
                    sx={{ bgcolor: 'grey.300' }}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody
            sx={{
              display: 'grid',
              position: 'relative',
            }}
          >
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  display: 'flex',
                  width: '100%',
                  // Animação de shimmer alternada para efeito cascata
                  animation: `shimmer 1.5s ease-in-out infinite`,
                  animationDelay: `${rowIndex * 0.05}s`,
                  '@keyframes shimmer': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 1 },
                  },
                }}
              >
                {columnWidths.map((width, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: width,
                      fontSize: '12px',
                      bgcolor: rowIndex % 2 === 0 ? 'grey.50' : 'white',
                      borderRight: '1px solid rgba(0,0,0,0.04)',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Skeleton 
                      variant="text" 
                      width={`${60 + Math.random() * 30}%`}
                      height={16}
                      sx={{ bgcolor: 'grey.200' }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Skeleton do contador */}
      <div className="mt-2">
        <Skeleton 
          variant="text" 
          width={200} 
          height={16}
          sx={{ bgcolor: 'grey.200' }}
        />
      </div>
    </div>
  );
}

export default TanstackTableSkeleton;
