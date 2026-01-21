import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';


export default function TanstackTable({ data, columns }: { data: any[], columns: any[] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    return (
    <TableContainer component={Paper}>
  <Table>
    <TableHead className='text-nowrap!'>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <TableCell key={header.id}>
              {header.column.columnDef.header as React.ReactNode}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHead>
    <TableBody>
      {table.getRowModel().rows.map(row => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map(cell => (
            <TableCell className='text-[12px]!' key={cell.id}>
              {cell.getValue() as React.ReactNode}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
    )
}