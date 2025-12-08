import { Skeleton } from "@mui/material";
import type { PlanBenefits } from "~/features/user/typings/BaseUser";
import Svg from "~/src/assets/svgs/_index";
function BenefitSpan({ text }: { text: string }) {
  return <span className="font-bold capitalize">{text}</span>;
}
function BenefitText({
  benefitKey,
  value,
}: {
  benefitKey: keyof PlanBenefits;
  value: string;
}) {
  switch (benefitKey) {
    case "ML_accounts":
      return (
        <p>
          <BenefitSpan text={value} /> Contas de Marketplace
        </p>
      );
    case "colab_accounts":
      return (
        <p>
          <BenefitSpan text={value} /> Contas de Colaborador
        </p>
      );
    case "catalog_monitoring":
      return (
        <p>
          <BenefitSpan text={value} /> Monitoramento de Catálogo
        </p>
      );
    case "dias_historico_vendas":
      return (
        <p>
          <BenefitSpan text={value} /> Dias de Histórico de Vendas
        </p>
      );
    case "dias_registro_atividades":
      return (
        <p>
          <BenefitSpan text={value} /> Dias de Registro de Atividades
        </p>
      );
    case "gestao_financeira":
      return (
        <p>
          Gestão Financeira: <BenefitSpan text={value} />
        </p>
      );
    case "marketplaces_integrados":
      return (
        <p>
          <BenefitSpan text={value} /> Marketplaces Integrados
        </p>
      );
    case "sincronizacao_estoque":
      return <p>Sincronização de Estoque</p>;
    case "clube_beergam":
      return <p>Clube Beergam</p>;
    case "comunidade_beergam":
      return <p>Comunidade Beergam</p>;
    case "ligacao_quinzenal":
      return <p>Ligação Quinzenal</p>;
    case "novidades_beta":
      return <p>Novidades Beta</p>;
  }
}
export default function PlanBenefitsCard({
  benefits,
  loading = false,
}: {
  benefits?: PlanBenefits | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
      </div>
    );
  }
  if (!benefits || loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={100} height={24} />
      </div>
    );
  }
  return Object.entries(benefits).map(([key, value]) => (
    <div key={key} className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {typeof value === "boolean" ? (
          value ? (
            <Svg.check
              width={16}
              height={16}
              tailWindClasses="text-beergam-green size-6"
            />
          ) : (
            <Svg.x
              width={16}
              height={16}
              tailWindClasses="text-beergam-red size-6"
            />
          )
        ) : (
          <Svg.check
            width={16}
            height={16}
            tailWindClasses="text-beergam-green size-6"
          />
        )}
      </div>
      <BenefitText
        benefitKey={key as keyof PlanBenefits}
        value={value.toString()}
      />
    </div>
  ));
}
