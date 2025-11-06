import { Tooltip } from "react-tooltip";
import Svg from "~/src/assets/svgs/_index";

export default function Hint({
  message,
  anchorSelect,
}: {
  message: string;
  anchorSelect: string;
}) {
  return (
    <>
      <a data-tooltip-id={anchorSelect}>
        <Svg.information_circle
          width={17}
          height={17}
          tailWindClasses="stroke-beergam-gray min-w-[17px] min-h-[17px]"
        />
      </a>
      <Tooltip id={anchorSelect} content={message} className="z-50" />
    </>
  );
}
