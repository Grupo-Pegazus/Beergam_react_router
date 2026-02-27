import { Paper } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";

interface ShopeeSectionProps {
  sellerType: "cnpj" | "cpf";
  paymentMethod: "pix" | "outros";
  ordersLast90Days: string;
  highlightCampaign: boolean;
  freightCouponValue: string;
  onSellerTypeChange: (value: "cnpj" | "cpf") => void;
  onPaymentMethodChange: (value: "pix" | "outros") => void;
  onOrdersLast90DaysChange: (value: string) => void;
  onHighlightCampaignChange: (value: boolean) => void;
  onFreightCouponValueChange: (value: string) => void;
}

const SELLER_TYPE_OPTIONS = [
  { value: "cnpj", label: "CNPJ" },
  { value: "cpf", label: "CPF" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "outros", label: "Outros" },
  { value: "pix", label: "Pix" },
];

export default function ShopeeSection({
  sellerType,
  paymentMethod,
  ordersLast90Days,
  highlightCampaign,
  freightCouponValue,
  onSellerTypeChange,
  onPaymentMethodChange,
  onOrdersLast90DaysChange,
  onHighlightCampaignChange,
  onFreightCouponValueChange,
}: ShopeeSectionProps) {
  const isCpf = sellerType === "cpf";

  return (
    <Paper className="space-y-4">
      <h2 className="text-lg font-semibold text-beergam-typography-primary">
        Configurações Shopee
      </h2>

      <Fields.wrapper>
        <Fields.label text="Tipo de vendedor" />
        <Fields.select
          name="sellerType"
          value={sellerType}
          widthType="full"
          options={SELLER_TYPE_OPTIONS}
          onChange={(e) =>
            onSellerTypeChange(e.target.value as "cnpj" | "cpf")
          }
        />
      </Fields.wrapper>

      <Fields.wrapper>
        <Fields.label
          text="Método de pagamento"
          hint="Pagamentos via Pix têm subsídio da Shopee que reduz o custo do vendedor"
        />
        <Fields.select
          name="paymentMethod"
          value={paymentMethod}
          widthType="full"
          options={PAYMENT_METHOD_OPTIONS}
          onChange={(e) =>
            onPaymentMethodChange(e.target.value as "pix" | "outros")
          }
        />
      </Fields.wrapper>

      {isCpf && (
        <Fields.wrapper>
          <Fields.label
            text="Pedidos nos últimos 90 dias"
            hint="Vendedores CPF com mais de 450 pedidos em 90 dias pagam +R$3 por item"
          />
          <Fields.numericInput
            format="integer"
            value={ordersLast90Days === "" ? undefined : Number(ordersLast90Days)}
            onChange={(v) =>
              onOrdersLast90DaysChange(v === undefined ? "" : String(v))
            }
            placeholder="0"
            min={0}
          />
        </Fields.wrapper>
      )}

      <Fields.wrapper>
        <Fields.label
          text="Cupom de frete (R$)"
          hint="Valor do cupom de frete aplicado ao pedido. O vendedor arca com 25% (máx. R$40)"
        />
        <Fields.numericInput
          prefix="R$"
          format="decimal"
          decimalScale={2}
          value={freightCouponValue === "" ? undefined : Number(freightCouponValue)}
          onChange={(v) =>
            onFreightCouponValueChange(v === undefined ? "" : String(v))
          }
          placeholder="0,00"
          min={0}
          max={40}
        />
        <p className="text-xs text-beergam-gray mt-1">Opcional · máx. R$40</p>
      </Fields.wrapper>

      <Fields.wrapper>
        <Fields.checkbox
          name="highlightCampaign"
          checked={highlightCampaign}
          onChange={(e) => onHighlightCampaignChange(e.target.checked)}
          label="Campanha de Destaque (+2,5%)"
        />
        <p className="text-xs text-beergam-gray mt-1">
          Ativa taxa adicional de +2,5% sobre o preço de venda
        </p>
      </Fields.wrapper>
    </Paper>
  );
}
