export default function ColabPhoto({
  photo_id,
  tailWindClasses,
  name,
}: {
  photo_id: string | null | undefined;
  tailWindClasses: string;
  name: string;
}) {
  const hasPhoto =
    photo_id != null && photo_id != undefined && photo_id.length > 0;
  return (
    <div className={`rounded-full ${tailWindClasses}`}>
      {hasPhoto ? (
        <img
          src={photo_id}
          alt="Colab Photo"
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="w-full h-full bg-beergam-orange rounded-full flex items-center justify-center">
          <h4 className="text-white">{name.charAt(0).toUpperCase()}</h4>
        </div>
      )}
    </div>
  );
}
