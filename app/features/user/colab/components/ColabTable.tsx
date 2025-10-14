import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState, type Dispatch } from "react";
import Svg from "~/src/assets/svgs";
import { type IColab } from "../../typings/Colab";
import ColabRow from "./ColabRow";

export default function ColabTable({
  colabs,
  setCurrentColab,
}: {
  colabs: IColab[];
  setCurrentColab: Dispatch<{ colab: IColab | null; action: string | null }>;
}) {
  const availableActions = ["Editar", "Excluir"];
  const colabActions = [
    {
      icon: <Svg.pencil width={20} height={20} />,
      label: availableActions[0],
    },
    {
      icon: <Svg.trash width={20} height={20} />,
      label: availableActions[1],
    },
  ];
  function handleAction(action: string, colab: IColab) {
    console.log("setando o colaborador ativo", colab);
    console.log("setCurrentColab.current", setCurrentColab);
    setCurrentColab({ colab: colab, action: action });
    switch (action) {
      case "Excluir": {
        console.log("Excluindo o colaborador", colab.name);
        break;
      }
      case "Editar": {
        console.log("Editando o colaborador", colab.name);
        break;
      }
      default: {
        console.log("Ação não encontrada", action);
        break;
      }
    }
  }
  function onAction(params: { action: string; colab: IColab }) {
    handleAction(params.action, params.colab);
  }
  const [page, setPage] = useState(0);
  function handlePageChange(event: unknown, newPage: number) {
    setPage(newPage);
  }
  const visibleColabs = colabs.slice(page * 5, (page + 1) * 5);
  return (
    <>
      <TableContainer component={Paper} sx={{ minHeight: "402px" }}>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell
                className=""
                style={{ fontWeight: "bold", zIndex: 20 }}
              >
                Nome
              </TableCell>
              <TableCell style={{ fontWeight: "bold", zIndex: 20 }}>
                Pin
              </TableCell>
              <TableCell style={{ fontWeight: "bold", zIndex: 20 }}>
                Status
              </TableCell>
              <TableCell style={{ fontWeight: "bold", zIndex: 20 }}>
                Tipo
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
                index={index}
                actions={colabActions}
                key={colab.pin}
                onAction={onAction}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={colabs.length}
        rowsPerPage={5}
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
    </>
  );
}
