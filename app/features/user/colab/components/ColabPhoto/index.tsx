import { useMemo } from "react";

export default function ColabPhoto({
  photo_id,
  name,
  masterPin,
  online = undefined,
}: {
  photo_id: string | null | undefined;
  name: string;
  masterPin: string | null | undefined;
  online?: boolean | undefined;
}) {
  const colabPhotoUrl = useMemo(() => {
    if (!masterPin || !photo_id) {
      return null;
    }
    return `https://cdn.beergam.com.br/colab_photos/colab/${masterPin}/${photo_id}.webp`;
  }, [masterPin, photo_id]);
  return (
    <div className="min-w-8 min-h-8 h-full w-full rounded-full relative object-cover object-center bg-beergam-orange flex items-center justify-center">
      {!colabPhotoUrl ? (
        <h4 className="text-white">{name.charAt(0).toUpperCase()}</h4>
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
