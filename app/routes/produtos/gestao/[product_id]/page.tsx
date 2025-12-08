import ProductDetails from "~/features/produtos/components/ProductDetails/ProductDetails";

interface ProductDetailsPageProps {
  productId: string;
}

export default function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  return <ProductDetails productId={productId} />;
}

