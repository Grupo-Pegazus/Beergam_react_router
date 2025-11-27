import Svg from "~/src/assets/svgs/_index";

interface ProductImageProps {
  imageId: string | null | undefined;
  alt: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "h-12 w-12",
  medium: "h-16 w-16",
  large: "h-24 w-24",
};

export default function ProductImage({
  imageId,
  alt,
  className = "",
  size = "medium",
}: ProductImageProps) {
  // TODO: Quando o backend estiver pronto, substituir por URL do R2
  // const imageUrl = imageId ? `https://cdn.beergam.com.br/products/${imageId}.webp` : null;
  const imageUrl = null;

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

