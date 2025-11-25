import React from "react";
import { Fields } from "~/src/components/utils/_fields";
import Svg from "~/src/assets/svgs/_index";

interface ProductSectionProps {
  productLink: string;
  onProductLinkChange: (value: string) => void;
  onSearch: () => void;
}

export default function ProductSection({
  productLink,
  onProductLinkChange,
  onSearch,
}: ProductSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-beergam-blue-primary">
        Produto
      </h2>
      <p className="text-sm text-beergam-gray">
        Cole aqui o link do produto que nós preencheremos automaticamente todas
        as informações relacionadas
      </p>
      <Fields.wrapper>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Svg.information_circle
              className="absolute left-3 top-1/2 -translate-y-1/2 text-beergam-gray"
              width={20}
              height={20}
            />
            <Fields.input
              type="text"
              placeholder="Insira aqui o link do produto (Mercado Livre)"
              value={productLink}
              onChange={(e) => onProductLinkChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <button
            type="button"
            onClick={onSearch}
            className="px-6 py-2.5 bg-beergam-orange text-white rounded hover:bg-beergam-orange-dark transition-colors whitespace-nowrap"
          >
            Procurar
          </button>
        </div>
      </Fields.wrapper>
    </div>
  );
}

