import { useMemo } from "react";
import Svg from "~/src/assets/svgs/_index";
export default function ColabPhoto({
  photo_id,
  name,
  masterPin,
  online = undefined,
  size = "medium",
  canUploadPhoto = false,
  onClick,
}: {
  photo_id: string | null | undefined;
  name: string | null | undefined;
  masterPin: string | null | undefined;
  online?: boolean | undefined;
  size?: "small" | "medium" | "large";
  canUploadPhoto?: boolean;
  onClick?: () => void;
}) {
  const colabPhotoUrl = useMemo(() => {
    if (!masterPin || !photo_id || !name) {
      return null;
    }
    return `https://cdn.beergam.com.br/colab_photos/colab/${masterPin}/${photo_id}.webp`;
  }, [masterPin, photo_id, name]);
  return (
    <button
      onClick={onClick}
      className={`rounded-full group relative object-cover object-center ${photo_id ? "bg-transparent" : "bg-beergam-orange"} flex items-center justify-center ${size === "small" ? "min-w-6 min-h-6 max-w-6 max-h-6" : size === "medium" ? "min-w-10 min-h-10 max-w-10 max-h-10" : "min-w-20 min-h-20 max-w-20 max-h-20"} ${canUploadPhoto ? "cursor-pointer" : "cursor-default!"}`}
    >
      {!colabPhotoUrl ? (
        <h4 className={`text-white ${size === "large" && "text-2xl"}`}>
          {name?.charAt(0).toUpperCase()}
        </h4>
      ) : (
        <img
          className="w-full h-full object-cover object-center rounded-full"
          src={colabPhotoUrl}
          alt={name ?? ""}
        />
      )}
      {online !== undefined && (
        <div
          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${online ? "bg-beergam-green" : "bg-beergam-red"} border border-beergam-white`}
        ></div>
      )}
      {canUploadPhoto && (
        <>
          <div className="opacity-0 group-hover:opacity-100 bg-beergam-white/20 absolute inset-0 rounded-full text-beergam-blue-primary flex items-center justify-center">
            <Svg.pencil_solid width={24} height={24} />
          </div>
          <div className="absolute -bottom-1 -right-2 rounded-full text-beergam-blue-primary flex items-center justify-center">
            <Svg.camera_solid width={24} height={24} />
          </div>
        </>
      )}
    </button>
  );
}
