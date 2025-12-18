import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import Svg from "~/src/assets/svgs/_index";
import { useSchedulings } from "../../hooks";
import type { SchedulingFilters, SchedulingList } from "../../typings";
import SchedulingCard from "./SchedulingCard";
import SchedulingTableRow from "./SchedulingTableRow";
import Loading from "~/src/assets/loading";
import PaginationBar from "~/src/components/ui/PaginationBar";

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
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <span className="text-slate-400">
              <Svg.information_circle tailWindClasses="h-10 w-10" />
            </span>
            <Typography variant="h6" color="text.secondary">
              Nenhum agendamento encontrado com os filtros atuais.
            </Typography>
          </div>
        ) : (
          <>
            {/* Versão Desktop - Tabela */}
            <div className="hidden md:block">
              <TableContainer component={Paper} sx={{ borderRadius: "16px", overflow: "hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b" }}>
                        ID
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b" }}>
                        Título
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b" }}>
                        Tipo
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b" }}>
                        Status
                      </TableCell>
                      <TableCell 
                        align="left" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: "0.75rem", 
                          textTransform: "uppercase", 
                          color: "#64748b",
                          display: { xs: "none", lg: "table-cell" },
                        }}
                      >
                        Data Prevista
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b" }}>
                        Itens
                      </TableCell>
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

