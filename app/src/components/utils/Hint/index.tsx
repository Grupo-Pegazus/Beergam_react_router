import Svg from "~/src/assets/svgs";

export default function Hint({
  message,
  isCusto,
}: {
  message: string;
  isCusto?: boolean;
}) {
  return (
    <div
      className={`group relative inline-flex w-fit cursor-pointer ${isCusto ? "text-red-500" : ""}`}
    >
      <div>
        <Svg.information_circle
          width={17}
          height={17}
          tailWindClasses="stroke-beergam-gray"
        />
      </div>
      <div className="invisible absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[170%] whitespace-nowrap rounded-md bg-[#333] px-2.5 py-1.5 text-xs text-white opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100">
        {message}
      </div>
    </div>
  );
}
