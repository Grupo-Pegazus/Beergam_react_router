import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Loading from "~/src/assets/loading";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import PaginationBar from "~/src/components/ui/PaginationBar";
import { useSchedulings } from "../../hooks";
import type { SchedulingFilters, SchedulingList } from "../../typings";
import SchedulingCard from "./SchedulingCard";
import SchedulingTableRow from "./SchedulingTableRow";

interface SchedulingListProps {
  filters?: Partial<SchedulingFilters>;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReceive?: (id: string) => void;
}

export default function SchedulingList({
  filters = {},
  onView,
  onEdit,
  onCancel,
  onReceive,
}: SchedulingListProps) {
  const [page, setPage] = useState(filters.page ?? 1);
  const [perPage, setPerPage] = useState(filters.per_page ?? 20);

  useEffect(() => {
    setPage(filters.page ?? 1);
  }, [filters.page]);

  useEffect(() => {
    setPerPage(filters.per_page ?? 20);
  }, [filters.per_page]);

  const { data, isLoading, error } = useSchedulings({
    ...filters,
    page,
    per_page: perPage,
  });

  const schedulings = useMemo<SchedulingList[]>(() => {
    if (!data?.success || !data.data?.schedulings) return [];
    return data.data.schedulings;
  }, [data]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? schedulings.length;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      Skeleton={Loading}
      ErrorFallback={() => (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
          Não foi possível carregar os agendamentos.
        </div>
      )}
    >
      <Stack spacing={2}>
        {schedulings.length === 0 ? (
          <Paper className="flex justify-center items-center gap-2 flex-col">
            <span className="text-beergam-typography-primary!">
              <Svg.information_circle tailWindClasses="h-10 w-10" />
            </span>
            <Typography
              variant="h6"
              className="text-beergam-typography-secondary!"
            >
              Nenhum agendamento encontrado com os filtros atuais.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Versão Desktop - Tabela */}
            <div className="hidden md:block">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell align="center">Tipo</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="left">Data Prevista</TableCell>
                      <TableCell align="center">Itens</TableCell>
                      <TableCell sx={{ width: 50 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedulings.map((scheduling) => (
                      <SchedulingTableRow
                        key={scheduling.id}
                        scheduling={scheduling}
                        onView={onView}
                        onEdit={onEdit}
                        onCancel={onCancel}
                        onReceive={onReceive}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Versão Mobile - Cards */}
            <div className="md:hidden">
              <Stack spacing={2}>
                {schedulings.map((scheduling) => (
                  <SchedulingCard
                    key={scheduling.id}
                    scheduling={scheduling}
                    onView={onView}
                    onEdit={onEdit}
                    onCancel={onCancel}
                    onReceive={onReceive}
                  />
                ))}
              </Stack>
            </div>
          </>
        )}

        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          entityLabel="agendamento(s)"
          onChange={handlePageChange}
        />
      </Stack>
    </AsyncBoundary>
  );
}
