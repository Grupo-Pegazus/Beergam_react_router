import { TableCell, TableRow } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useState } from "react";
import Svg from "~/src/assets/svgs";
import { UserStatus } from "../../typings/BaseUser";
import { ColabLevel, type IColab } from "../../typings/Colab";
export default function ColabRow({
  colab,
  index,
  actions,
  onAction,
}: {
  colab: IColab;
  index: number;
  actions: { icon: React.ReactNode; label: string }[];
  onAction: (params: { action: string; colab: IColab }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TableRow key={colab.pin}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full object-cover object-center bg-beergam-orange">
            {/* <img
                      src={colab.avatar ?? skeletonUser}
                      alt={colab.name}
                      className={`w-full h-full object-cover object-center ${!colab.avatar ? "p-1" : ""}`}
                    /> */}
          </div>
          <p>{colab.name}</p>
        </div>
      </TableCell>
      <TableCell className="font-bold">{colab.pin}</TableCell>
      <TableCell className="font-bold">
        <p>{UserStatus[colab.status as unknown as keyof typeof UserStatus]}</p>
      </TableCell>
      <TableCell className="font-bold">
        <p>
          {
            ColabLevel[
              colab.details.level as unknown as keyof typeof ColabLevel
            ]
          }
        </p>
      </TableCell>
      <TableCell>
        <SpeedDial
          ariaLabel="Ações do colaborador"
          icon={<Svg.elipsis_horizontal width={24} height={24} />}
          direction="down"
          open={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          onClose={() => setIsOpen(false)}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "start",
            justifyContent: "left",
            zIndex: 10 - index, //Tive que fazer isso apra a ação dos botões ficarem por cima de outros botões lol
            "& .MuiSpeedDial-fab": {
              backgroundColor: "var(--color-beergam-orange)",
              width: "36px",
              height: "36px",
            },
            "& .MuiSpeedDial-actions": {
              // backgroundColor: "pink",
              position: "fixed",
              top: `calc(20% + ${(index + 1) * 69}px)`,
              right: {
                xl: "148px",
                lg: "96px",
                sm: "96px",
              },
              zIndex: 2000,
              paddingTop: "10px",
              bottom: "-120px",
              height: "100px",
            },
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.label}
              icon={action.icon}
              onClick={() => {
                onAction({ action: action.label, colab: colab });
              }}
              slotProps={{
                tooltip: { title: action.label },
              }}
            />
          ))}
        </SpeedDial>
      </TableCell>
      <p></p>
    </TableRow>
  );
}
