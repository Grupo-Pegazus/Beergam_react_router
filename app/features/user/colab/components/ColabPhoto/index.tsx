import { useMemo } from "react";

export default function ColabPhoto({
  photo_id,
  name,
  masterPin,
  online = undefined,
  size = "medium",
}: {
  photo_id: string | null | undefined;
  name: string;
  masterPin: string | null | undefined;
  online?: boolean | undefined;
  size?: "small" | "medium" | "large";
}) {
  const colabPhotoUrl = useMemo(() => {
    if (!masterPin || !photo_id) {
      return null;
    }
    return `https://cdn.beergam.com.br/colab_photos/colab/${masterPin}/${photo_id}.webp`;
  }, [masterPin, photo_id]);
  return (
    <div
      className={`rounded-full relative object-cover object-center ${photo_id ? "bg-transparent" : "bg-beergam-orange"} flex items-center justify-center ${size === "small" ? "min-w-6 min-h-6" : size === "medium" ? "min-w-10 min-h-10" : "min-w-20 min-h-20"}`}
    >
      {!colabPhotoUrl ? (
        <h4 className={`text-white ${size === "large" && "text-2xl"}`}>
          {name.charAt(0).toUpperCase()}
        </h4>
      ) : (
        <img
          className="w-full h-full object-cover object-center rounded-full"
          src={colabPhotoUrl}
          alt={name}
        />
      )}
      {online !== undefined && (
        <div
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${online ? "bg-beergam-green" : "bg-beergam-red"} border border-beergam-white`}
        ></div>
      )}
    </div>
  );
}
