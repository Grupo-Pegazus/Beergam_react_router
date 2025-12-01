import BeergamButton from "~/src/components/utils/BeergamButton";
interface AlertButtonProps {
  onClick: () => void;
  type?: "confirm" | "cancel" | undefined;
  className?: string;
  text?: string;
}
export default function AlertButton({
  onClick,
  type,
  className,
  text,
}: AlertButtonProps) {
  const mainColor =
    type === "confirm"
      ? "beergam-orange"
      : type === "cancel"
        ? "beergam-blue"
        : "beergam-blue-primary";

  return (
    <BeergamButton
      title={text ?? ""}
      mainColor={mainColor}
      animationStyle="slider"
      onClick={onClick}
      className={`${className ?? ""} text-beergam-black border-amber-100 rounded-md text-xl font-bold`}

    />
  );
}
