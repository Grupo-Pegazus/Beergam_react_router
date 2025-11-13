import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useState } from "react";
import { Fields } from "~/src/components/utils/_fields";
import { UserStatus } from "../../../typings/BaseUser";
import { ColabLevel, type IColab } from "../../../typings/Colab";
import ColabRow from "../ColabRow";
import DeleteColab from "../DeleteColab";
export default function ColabTable({
  colabs,
  onTableAction,
  availableActions,
  currentColabPin,
}: {
  colabs: IColab[];
  onTableAction: (params: { action: string; colab: IColab }) => void;
  availableActions: Record<string, { icon: React.ReactNode }>;
  currentColabPin: string | null;
}) {
  const ROWS_PER_PAGE = 3;
  const [search, setSearch] = useState("");
  const [colabToDelete, setColabToDelete] = useState<IColab | null>(null);

  function onAction(params: { action: string; colab: IColab }) {
    if (params.action === "Excluir") {
      setColabToDelete(params.colab);
    } else {
      onTableAction(params);
    }
  }
  const [page, setPage] = useState(0);
  function handlePageChange(event: unknown, newPage: number) {
    setPage(newPage);
  }
  type SortBy = "tipo" | "status";
  type Order = "asc" | "desc";
  const [order, setOrder] = useState<Order>("asc");
  const [sortBy, setSortBy] = useState<SortBy | null>(null);
  function getLevelColab(colab: IColab) {
    return (
      ColabLevel[colab.details.level as unknown as keyof typeof ColabLevel] ??
      String(colab.details.level ?? "")
    );
  }
  function getStatusColab(colab: IColab) {
    return (
      UserStatus[colab.status as unknown as keyof typeof UserStatus] ??
      String(colab.status ?? "")
    );
  }

  function sortColabs(list: IColab[]) {
    if (!sortBy) return list;
    const sorted = [...list].sort((a, b) => {
      switch (sortBy) {
        case "status": {
          return getStatusColab(a).localeCompare(getStatusColab(b), "pt-BR", {
            sensitivity: "base",
          });
        }
        case "tipo": {
          return getLevelColab(a).localeCompare(getLevelColab(b), "pt-BR", {
            sensitivity: "base",
          });
        }
        default: {
          return 0;
        }
      }
    });
    return order === "asc" ? sorted : sorted.reverse();
  }

  const filteredColabs = colabs.filter(
    (colab) =>
      colab.name.toLowerCase().includes(search.toLowerCase()) ||
      colab.pin?.toLowerCase().includes(search.toLowerCase())
  );

  const visibleColabs = sortColabs(filteredColabs).slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE
  );

  function handleSort(property: SortBy) {
    if (sortBy === property) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(property);
      setOrder("asc");
    }
  }

  return (
    <>
      <Paper className="grid grid-cols-2 gap-4 mb-4 p-2">
        <Fields.input
          placeholder="Pesquisar colaborador por nome ou pin"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TablePagination
          component={"div"}
          count={filteredColabs.length}
          rowsPerPage={ROWS_PER_PAGE}
          page={page}
          sx={{
            ".MuiTablePagination-selectLabel": {
              display: "none",
            },
            ".MuiInputBase-root": {
              display: "none",
            },
          }}
          onPageChange={handlePageChange}
        />
      </Paper>
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "unset",
          overflowY: "unset",
          height: "100%",
        }}
      >
        <Table
          sx={{
            tableLayout: "fixed",
            minHeight: `${ROWS_PER_PAGE * 88}px`,
            overflowX: "auto",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                className=""
                style={{ fontWeight: "bold", zIndex: 20 }}
              >
                Nome
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", zIndex: 20, width: "100px" }}
              >
                Pin
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", zIndex: 20, width: "120px" }}
              >
                <TableSortLabel
                  active={true}
                  sx={{
                    "& .MuiTableSortLabel-icon": {
                      fill:
                        sortBy === "status"
                          ? "var(--color-beergam-orange)"
                          : "currentColor",
                    },
                  }}
                  direction={sortBy === "status" ? order : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", zIndex: 20, width: "160px" }}
              >
                <TableSortLabel
                  active={true}
                  sx={{
                    "& .MuiTableSortLabel-icon": {
                      fill:
                        sortBy === "tipo"
                          ? "var(--color-beergam-orange)"
                          : "currentColor",
                    },
                  }}
                  direction={sortBy === "tipo" ? order : "asc"}
                  onClick={() => handleSort("tipo")}
                >
                  Tipo
                </TableSortLabel>
              </TableCell>
              <TableCell style={{ fontWeight: "bold", zIndex: 20 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleColabs.map((colab, index) => (
              <ColabRow
                colab={colab}
                isCurrentColab={
                  currentColabPin ? currentColabPin === colab.pin : false
                }
                index={index}
                actions={Object.keys(availableActions).map((action) => ({
                  icon: availableActions[action].icon,
                  label: action,
                }))}
                key={colab.pin}
                onAction={onAction}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteColab
        colab={colabToDelete}
        onDeleteSuccess={(colab) => {
          onTableAction({ action: "Excluir", colab });
          setColabToDelete(null);
        }}
        onClose={() => setColabToDelete(null)}
      />
    </>
  );
}
