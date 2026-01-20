import Svg from "~/src/assets/svgs/_index";

interface ProductImageProps {
  imageUrl: string | null | undefined;
  alt: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "size-12",
  medium: "size-16",
  large: "size-24",
};

export default function ProductImage({
  imageUrl,
  alt,
  className = "",
  size = "medium",
}: ProductImageProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={`rounded-lg object-cover shrink-0 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClasses[size]} items-center justify-center rounded-lg bg-slate-100 text-slate-400 shrink-0 ${className}`}
    >
      <Svg.bag tailWindClasses="h-6 w-6" />
    </div>
  );
}
