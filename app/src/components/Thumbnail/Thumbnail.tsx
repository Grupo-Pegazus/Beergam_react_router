import Svg from "~/src/assets/svgs/_index";

interface ThumbnailProps {
  thumbnail: string;
  tailWindClasses?: string;
}

export default function Thumbnail({ thumbnail, tailWindClasses }: ThumbnailProps) {
    if (thumbnail) {
      return (
        <img
          src={thumbnail}
          className={`h-16 w-16 rounded-lg object-cover shrink-0 ${tailWindClasses}`}
        />
      );
    }
    return (
      <div className={`flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400 shrink-0 ${tailWindClasses}`}>
        <Svg.bag tailWindClasses="h-6 w-6" />
      </div>
    );
  }