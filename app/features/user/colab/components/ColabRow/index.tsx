import { Paper, TableCell, TableRow } from "@mui/material";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useState } from "react";
import { UserStatus } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs";
import { ColabLevel, type IColab } from "../../../typings/Colab";
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
  function Badge({
    className,
    text,
    pinClassName,
  }: {
    className: string;
    text: string;
    pinClassName: string;
  }) {
    return (
      <Paper className={`flex items-center gap-2 !p-2 rounded-2xl${className}`}>
        <div className={`w-2 h-2 rounded-full ${pinClassName}`}></div>
        <p>{text}</p>
      </Paper>
    );
  }
  function ColabLevelBadge({ level }: { level: ColabLevel }) {
    return (
      <Badge
        className="!w-[140px]"
        text={level}
        pinClassName={`${level == ColabLevel.ADMIN ? "bg-beergam-orange" : "bg-beergam-blue-primary"}`}
      />
    );
  }
  function ColabStatusBadge({ status }: { status: UserStatus }) {
    return (
      <Badge
        className="!w-[100px]"
        text={status}
        pinClassName={`${status == UserStatus.ACTIVE ? "bg-beergam-orange" : "bg-beergam-gray"}`}
      />
    );
  }
  return (
    <TableRow key={colab.pin}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="min-w-8 min-h-8 rounded-full relative object-cover object-center bg-beergam-orange flex items-center justify-center">
            <h4 className="text-white">{colab.name.charAt(0).toUpperCase()}</h4>
            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-beergam-red border-1 border-beergam-white"></div>
          </div>
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
        <ColabStatusBadge status={colab.status} />
      </TableCell>
      <TableCell className="font-bold">
        <ColabLevelBadge level={colab.details.level} />
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
