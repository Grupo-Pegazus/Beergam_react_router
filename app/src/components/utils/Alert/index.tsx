import { Paper } from "@mui/material";
import React from "react";
import Svg from "~/src/assets/svgs/_index";
import type { SvgBaseProps } from "~/src/assets/svgs/IconBase";
import { Modal, type ModalProps } from "../Modal";
// import Modal from "../Modal";
// interface AlertProps extends Omit<ClickAwayListenerProps, "children"> {
//   type?: "success" | "error" | "warning" | "info" | undefined;
//   title: string;
//   open: boolean;
//   customIcon?: keyof typeof Svg;
//   onConfirm?: () => void;
//   cancelText?: string;
//   cancelClassName?: string;
//   confirmText?: string;
//   confirmClassName?: string;
//   children: React.ReactNode[];
// }
function Icon({
  type,
  SvgBaseProps,
  customIcon,
}: {
  type?: AlertProps["type"];
  SvgBaseProps: SvgBaseProps;
  customIcon?: keyof typeof Svg;
}) {
  function getSvg() {
    if (customIcon) {
      return React.createElement(Svg[customIcon], {
        ...SvgBaseProps,
        stroke: "white",
      });
    }
    switch (type) {
      case "success":
        return <Svg.check {...SvgBaseProps} stroke="white" />;
      case "error":
        return <Svg.circle_x {...SvgBaseProps} stroke="white" />;
      case "warning":
        return <Svg.megaphone {...SvgBaseProps} stroke="white" />;
      case "info":
        return <Svg.information_circle {...SvgBaseProps} stroke="white" />;
    }
  }
  return (
    <div
      className={`size-20 flex items-center justify-center rounded-full ${type === "success" ? "bg-beergam-green-primary" : type === "error" ? "bg-beergam-red-primary" : type === "warning" ? "bg-beergam-yellow" : type === "info" ? "bg-beergam-blue" : "bg-beergam-blue-primary"}`}
    >
      {getSvg()}
    </div>
  );
}
// export default function Alert({
//   onClickAway,
//   children,
//   open,
//   ...props
// }: AlertProps) {
//   const [isClosed, setIsClosed] = useState(true);
//   const [fade, setFade] = useState(false);
//   useEffect(() => {
//     if (open) {
//       setIsClosed(false);
//       window.setTimeout(() => {
//         setFade(true);
//       }, 200);
//     } else {
//       setFade(false);
//       window.setTimeout(() => {
//         setIsClosed(true);
//       }, 500);
//     }
//   }, [open]);
//   if (isClosed) return null;
//   function handleClickAway(e: MouseEvent | TouchEvent) {
//     onClickAway?.(e);
//   }
//   return (
//     <div
//       className={`fixed z-[99999] top-0 left-0 w-full h-full flex justify-center items-center bg-beergam-black/50 ${fade ? "opacity-100" : "opacity-0"}`}
//     >
//       <ClickAwayListener
//         onClickAway={(e) => {
//           if (!open) return;
//           handleClickAway(e);
//         }}
//       >
//         <Paper className="flex flex-col items-center justify-center gap-4 min-w-2xl">
//           <div>
//             <Icon
//               type={props.type}
//               SvgBaseProps={{ width: "60px", height: "60px" }}
//               customIcon={props.customIcon}
//             />
//           </div>
//           <div className="flex flex-col items-center justify-center gap-2">
//             <h3 className="text-beergam-blue-primary font-bold text-2xl">
//               {props.title}
//             </h3>
//             {children}
//           </div>

//           <div className="flex items-center justify-center gap-4">
//             {props.onConfirm && (
//               <AlertButton
//                 onClick={props.onConfirm}
//                 type="confirm"
//                 text={props.confirmText ?? "Confirmar"}
//                 className={props.confirmClassName}
//               />
//             )}
//             <AlertButton
//               onClick={(e) => {
//                 handleClickAway(e);
//               }}
//               type="cancel"
//               text={props.cancelText ?? "Voltar"}
//               className={props.cancelClassName}
//             />
//           </div>
//         </Paper>
//       </ClickAwayListener>
//     </div>
//   );
// }

interface AlertProps extends ModalProps {
  type?: "success" | "error" | "warning" | "info" | undefined;
  customIcon?: keyof typeof Svg;
  onConfirm?: () => void;
  cancelText?: string;
  cancelClassName?: string;
  confirmText?: string;
  confirmClassName?: string;
}
export default function Alert({
  type,
  customIcon,
  onConfirm,
  cancelText,
  cancelClassName,
  confirmText,
  confirmClassName,
  children,
  ...props
}: AlertProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title={props.title}>
      {/* {children} */}
      <Paper className="flex flex-col items-center justify-center gap-4 min-w-2xl">
        <div>
          <Icon
            type={type}
            SvgBaseProps={{ width: "60px", height: "60px" }}
            customIcon={customIcon}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <h3 className="text-beergam-blue-primary font-bold text-2xl">
            {props.title}
          </h3>
          {children}
        </div>

        {/* <div className="flex items-center justify-center gap-4">
          {onConfirm && (
            <AlertButton
              onClick={onConfirm}
              type="confirm"
              text={confirmText ?? "Confirmar"}
              className={confirmClassName}
            />
          )}
          <AlertButton
            onClick={(e) => {
              handleClickAway(e);
            }}
            type="cancel"
            text={props.cancelText ?? "Voltar"}
            className={props.cancelClassName}
          />
        </div> */}
      </Paper>
    </Modal>
  );
}
