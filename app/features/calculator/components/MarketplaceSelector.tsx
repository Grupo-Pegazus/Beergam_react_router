import MainCards from "~/src/components/ui/MainCards";
import { Fields } from "~/src/components/utils/_fields";

interface MarketplaceSelectorProps {
  value: "ml" | "shopee";
  onChange: (value: "ml" | "shopee") => void;
}

export default function MarketplaceSelector({
  value,
  onChange,
}: MarketplaceSelectorProps) {
  return (
    <MainCards>
      <Fields.wrapper>
        <Fields.label
          text="Marketplace"
          hint="Selecione o marketplace para calcular"
        />
        <Fields.select
          value={value}
          options={[
            { value: "ml", label: "Mercado Livre" },
            { value: "shopee", label: "Shopee" },
          ]}
          onChange={(e) => onChange(e.target.value as "ml" | "shopee")}
        />
      </Fields.wrapper>
    </MainCards>
  );
}

