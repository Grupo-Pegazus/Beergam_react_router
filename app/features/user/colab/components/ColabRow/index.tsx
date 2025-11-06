import { TableCell, TableRow } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useState } from "react";
import Svg from "~/src/assets/svgs";
import { type IColab } from "../../../typings/Colab";
import ColabLevelBadge from "../Badges/ColabLevelBadge";
import ColabStatusBadge from "../Badges/ColabStatusBadge";
import ColabPhoto from "../ColabPhoto";
export default function ColabRow({
  colab,
  index,
  actions,
  onAction,
  isCurrentColab,
}: {
  colab: IColab;
  index: number;
  actions: { icon: React.ReactNode; label: string }[];
  onAction: (params: { action: string; colab: IColab }) => void;
  isCurrentColab: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TableRow
      key={colab.pin}
      sx={{
        backgroundColor: isCurrentColab
          ? "var(--color-beergam-orange-light)"
          : "transparent",
      }}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <ColabPhoto
            photo_id={colab.details.photo_id}
            tailWindClasses="min-w-8 min-h-8 rounded-full relative object-cover object-center bg-beergam-orange flex items-center justify-center"
            name={colab.name}
          />
          <div>
            <p
              className="text-ellipsis overflow-hidden whitespace-nowrap"
              style={{ textWrap: "revert-layer" }}
            >
              {colab.name}
            </p>
            <p className="text-xs text-beergam-gray-light">OFFLINE</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="font-bold">{colab.pin}</TableCell>
      <TableCell className="font-bold">
        <ColabStatusBadge status={colab.status} className="!w-[100px]" />
      </TableCell>
      <TableCell className="font-bold">
        <ColabLevelBadge level={colab.details.level} className="!w-[140px]" />
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
            // backgroundColor: "green",
            position: "relative",
            display: "flex",
            alignItems: "start",
            justifyContent: "left",
            paddingLeft: "5px",
            zIndex: 10 - index, //Tive que fazer isso apra a ação dos botões ficarem por cima de outros botões lol
            "& .MuiSpeedDial-fab": {
              backgroundColor: "var(--color-beergam-orange)",
              width: "36px",
              height: "36px",
            },
            "& .MuiSpeedDial-actions": {
              // backgroundColor: "pink",
              position: "absolute",
              left: "-2.5px",
              zIndex: 2000,
              paddingTop: "10px",
              bottom: "-120px",
              height: "150px",
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
    </TableRow>
  );
}
