import { useQuery } from "@tanstack/react-query";
import Speedometer from "~/features/anuncios/components/Speedometer/Speedometer";
import { anuncioService } from "~/features/anuncios/service";
import { marketplaceService } from "~/features/marketplace/service";
import {
  MarketplaceOrderParseStatusLabel,
  MarketplaceType,
  MarketplaceTypeLabel,
} from "~/features/marketplace/typings";
import { metricsAccountService } from "~/features/metricsAccount/service";
import {
  getColorName,
  getMeliReputationColor,
} from "~/features/metricsAccount/utils";
import authStore from "~/features/store-zustand";
import UserFields from "~/features/user/components/UserFields";
import type { IColab } from "~/features/user/typings/Colab";
import type { IUser } from "~/features/user/typings/User";
import { FormatGestaoFinanceira, isMaster } from "~/features/user/utils";
import Section from "~/src/components/ui/Section";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
export default function VisaoGeral({ user }: { user: IUser | IColab }) {
  const marketplace = authStore.use.marketplace();
  const subscription = authStore.use.subscription();
  const { data: marketplacesAccounts } = useQuery({
    queryKey: ["marketplacesAccounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
  });
  const { data: reputation } = useQuery({
    queryKey: ["reputation", marketplace?.marketplace_type],
    queryFn: () =>
      metricsAccountService.getReputationAccount(
        marketplace?.marketplace_type as MarketplaceType
      ),
    enabled: Boolean(marketplace?.marketplace_type),
    staleTime: 1000 * 60 * 5,
  });
  const { data: anuncios } = useQuery({
    queryKey: ["anuncios"],
    queryFn: () => anuncioService.getAnuncios(),
    enabled: Boolean(marketplace?.marketplace_type),
  });
  const transactions =
    reputation?.data?.reputation?.seller_reputation?.transactions;
  const reputationColor = getMeliReputationColor(
    reputation?.data?.reputation?.seller_reputation?.level_id
  );
  const anunciosTotal = anuncios?.data?.pagination
    ? anuncios?.data?.pagination.total_count
    : null;
  return (
    <>
      {isMaster(user) && (
        <Section className="bg-beergam-mui-paper!" title="Dados Gerais">
          <div className="grid gap-4">
            <div className="flex items-start md:items-center flex-col md:flex-row gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Speedometer
                  value={Object.keys(user.colabs).length}
                  size={80}
                  mode="asc"
                  numberToCompare={subscription?.plan.benefits.colab_accounts}
                />
                <Fields.label
                  text={`${Object.keys(user.colabs).length} de ${subscription?.plan.benefits.colab_accounts} Colaboradores Registrados`}
                />
              </div>
              <BeergamButton
                title="Melhorar Plano"
                link="/interno/config?session=Minha Assinatura"
              />
            </div>
            <div className="flex items-start md:items-center flex-col md:flex-row gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Speedometer
                  value={marketplacesAccounts?.data?.length ?? null}
                  size={80}
                  mode="asc"
                  numberToCompare={subscription?.plan.benefits.ML_accounts}
                />
                {marketplacesAccounts?.data?.length ? (
                  <Fields.label
                    text={`${marketplacesAccounts?.data?.length} de ${subscription?.plan.benefits.ML_accounts} Marketplaces Integrados`}
                  />
                ) : (
                  <Fields.label text="Não disponível" />
                )}
              </div>
              <BeergamButton
                title="Melhorar Plano"
                link="/interno/config?session=Minha Assinatura"
              />
            </div>
          </div>
          <div className="grid mt-4 md:grid-cols-3 gap-4">
            <UserFields
              label="Gestão Financeira"
              name="gestao_financeira"
              value={
                subscription?.plan.benefits.gestao_financeira
                  ? FormatGestaoFinanceira(
                      subscription?.plan.benefits.gestao_financeira
                    )
                  : "Não disponível"
              }
              canAlter={false}
              hint="A gestão financeira é o processo de controle e monitoramento dos fluxos de caixa e finanças do seu Marketplace."
            />
            <UserFields
              label="Tipos de Marketplace"
              name="marketplace_types"
              value={
                subscription?.plan.benefits.marketplaces_integrados ??
                "Não disponível"
              }
              canAlter={false}
            />
            <UserFields
              label="Histórico de Vendas"
              name="historico_vendas"
              value={`${subscription?.plan.benefits.dias_historico_vendas} dias`}
              canAlter={false}
            />
          </div>
          {/* <UserFields label="Colaboradores Cadastrados" name="colaborators_count" value={user.details.colabs} canAlter={false} /> */}
        </Section>
      )}
      <Section
        className="bg-beergam-mui-paper!"
        title="Marketplace Selecionado"
        actions={
          <BeergamButton
            title="Gerenciar Marketplaces"
            link="/interno/config?session=Marketplaces"
          />
        }
      >
        {marketplace ? (
          <>
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4">
              <div className="size-40 min-w-40 border-2 border-beergam-gray rounded-full overflow-hidden">
                <img
                  src={marketplace.marketplace_image}
                  alt={marketplace.marketplace_name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                <UserFields
                  label="Nome"
                  name="marketplace_name"
                  value={marketplace.marketplace_name}
                  canAlter={false}
                />
                <UserFields
                  label="Tipo"
                  name="marketplace_type"
                  value={MarketplaceTypeLabel[marketplace.marketplace_type]}
                  canAlter={false}
                />
                <UserFields
                  label="Status de Parse"
                  name="marketplace_status_parse"
                  value={
                    MarketplaceOrderParseStatusLabel[
                      marketplace.orders_parse_status
                    ]
                  }
                  canAlter={false}
                />
                <UserFields
                  label="Total de Transações"
                  name="transactions"
                  value={transactions ? transactions.total : 0}
                  canAlter={false}
                />
                <UserFields
                  label="Reputação da Conta"
                  name="reputation"
                  value={
                    reputationColor
                      ? getColorName(reputationColor)
                      : "Não disponível"
                  }
                  canAlter={false}
                />
                {anunciosTotal && (
                  <UserFields
                    label="Total de Anúncios"
                    name="anuncios_count"
                    value={anunciosTotal}
                    canAlter={false}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-beergam-typography-secondary">
              Nenhum marketplace selecionado.
            </p>
          </>
        )}
      </Section>
    </>
  );
}
