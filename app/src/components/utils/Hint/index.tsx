import { Tooltip } from "react-tooltip";
import Svg from "~/src/assets/svgs";

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
          tailWindClasses="stroke-beergam-gray"
        />
      </a>
      <Tooltip id={anchorSelect} content={message} />
    </>
  );
}
