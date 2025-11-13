import type { Anuncio } from "../../typings";
import Svg from "~/src/assets/svgs/_index";

interface ThumbnailProps {
  anuncio: Anuncio;
}

export default function Thumbnail({ anuncio }: ThumbnailProps) {
    if (anuncio.thumbnail) {
      return (
        <img
          src={anuncio.thumbnail}
          alt={anuncio.name}
          className="h-16 w-16 rounded-lg object-cover shrink-0"
        />
      );
    }
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400 shrink-0">
        <Svg.bag tailWindClasses="h-6 w-6" />
      </div>
    );
  }