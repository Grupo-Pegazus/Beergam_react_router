import Paper from "@mui/material/Paper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { ApiResponse } from "~/features/apiClient/typings";
import { useAuthUser } from "~/features/auth/context/AuthStoreContext";
import { marketplaceService } from "~/features/marketplace/service";
import type {
  BaseMarketPlace,
  MarketplaceType,
} from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import { useUpsertTax, useUserTaxes } from "~/features/taxes/hooks";
import { taxesService } from "~/features/taxes/service";
import {
  MonthKeys,
  TranslatedMonthKeys,
  type MonthKey,
} from "~/features/taxes/typings";
import UserFields from "~/features/user/components/UserFields";
import { userService } from "~/features/user/service";
import type { IUser } from "~/features/user/typings/User";
import { CalcTax } from "~/features/user/typings/User";
import { FormatCalcTax, isMaster } from "~/features/user/utils";
import { default as Loading, default as Spining } from "~/src/assets/loading";
import Svg from "~/src/assets/svgs/_index";
import Section from "~/src/components/ui/Section";
import Alert from "~/src/components/utils/Alert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Hint from "~/src/components/utils/Hint";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { CDN_IMAGES, getMarketplaceImageUrl } from "~/src/constants/cdn-images";
const AVAILABLE_YEARS = [2026, 2025, 2024];

// Função auxiliar para extrair o valor numérico do tax
function getTaxValue(
  tax: { source: string; parsedValue: number } | number | null
): number | null {
  if (tax === null || tax === undefined) return null;
  if (typeof tax === "number") return tax;
  if (typeof tax === "object" && "parsedValue" in tax) return tax.parsedValue;
  return null;
}

export default function Impostos() {
  const user = useAuthUser();
  const queryClient = useQueryClient();
  const recalc = useMutation({
    mutationFn: ({
      year,
      month,
      marketplace_shop_id,
      marketplace_type,
    }: {
      year: number;
      month: number;
      marketplace_shop_id: string;
      marketplace_type: MarketplaceType;
    }) => {
      return taxesService.recalculatePeriod({
        year,
        month,
        marketplace_shop_id,
        marketplace_type,
      });
    },
    onSuccess: (data) => {
      if (!data.success) {
        throw new Error(data.message);
      }
    },
  });

  const [selectedAccount, setSelectedAccount] =
    useState<BaseMarketPlace | null>(null);
  const [search, setSearch] = useState("");
  const { data: accounts } = useQuery({
    queryKey: ["marketplaces-accounts"],
    queryFn: () => marketplaceService.getMarketplacesAccounts(),
  });
  const { openModal, closeModal } = useModal();
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>(
    MonthKeys[new Date().getMonth()]
  );
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { data: taxes, isLoading: taxesLoading } = useUserTaxes({
    marketplace_shop_id: selectedAccount?.marketplace_shop_id,
    marketplace_type: selectedAccount?.marketplace_type as
      | MarketplaceType
      | undefined,
    year,
  });
  const upsert = useUpsertTax();
  const [calcTax, setCalcTax] = useState<string | null>(
    (user && isMaster(user) && user.details?.calc_tax) ? user.details.calc_tax : null
  );
  const [taxPercentFixed, setTaxPercentFixed] = useState<string | null>(
    (user && isMaster(user) && user.details?.tax_percent_fixed) ? user.details.tax_percent_fixed : null
  );

  // Sincroniza tax_percent_fixed com o valor do usuário quando o user muda
  useEffect(() => {
    if (user && isMaster(user) && user.details?.tax_percent_fixed) {
      setTaxPercentFixed(user.details.tax_percent_fixed);
    }
  }, [user]);

  // Verifica se os valores foram alterados em relação ao usuário
  const hasChanges = useMemo(() => {
    if (!user || !isMaster(user)) return false;
    
    const userCalcTax = user.details?.calc_tax ?? null;
    const userTaxPercentFixed = user.details?.tax_percent_fixed ?? null;
    
    const calcTaxChanged = calcTax !== userCalcTax;
    const taxPercentFixedChanged = taxPercentFixed !== userTaxPercentFixed;
    
    return calcTaxChanged || taxPercentFixedChanged;
  }, [user, calcTax, taxPercentFixed]);

  const updateUserTaxSettings = useMutation({
    mutationFn: async (data: { calc_tax: string | null; tax_percent_fixed: string | null }) => {
      if (!user || !isMaster(user)) throw new Error("Usuário não encontrado ou não é master");
      // Envia apenas os campos de imposto para evitar erro de validação
      const payload = {
        details: {
          calc_tax: data.calc_tax as CalcTax | null,
          tax_percent_fixed: data.tax_percent_fixed,
        },
      };
      const response = await userService.editUserInformation(payload as unknown as IUser);
      if (!response.success) {
        throw new Error(response.message || "Erro ao atualizar configurações de imposto");
      }
      return response;
    },
    onSuccess: (data) => {
      if (data.data) {
        authStore.getState().updateUserDetails(data.data);
        toast.success("Configurações de imposto atualizadas com sucesso");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar configurações de imposto");
    },
  });

  const filteredAccounts =
    accounts?.data && accounts?.data.length > 0
      ? accounts?.data?.filter((account) =>
          account.marketplace_name.toLowerCase().includes(search.toLowerCase())
        )
      : null;
  const handleMarketplaceSelect = (account: BaseMarketPlace) => {
    if (account.marketplace_shop_id === selectedAccount?.marketplace_shop_id) {
      setSelectedAccount(null);
    } else {
      setSelectedAccount(account);
    }
  };

  const [selectedTax, setSelectedTax] = useState<number | null>(
    getTaxValue(taxes?.impostos?.[selectedMonth]?.tax ?? null) ?? null
  );
  useEffect(() => {
    setSelectedTax(
      getTaxValue(taxes?.impostos?.[selectedMonth]?.tax ?? null) ?? null
    );
  }, [selectedMonth, taxes]);

  // Função para verificar se o período está no futuro
  const isPeriodInFuture = (month: MonthKey, year: number): boolean => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() retorna 0-11, então +1 para 1-12
    
    // Se o ano for maior que o atual, está no futuro
    if (year > currentYear) return true;
    
    // Se o ano for igual ao atual, verifica o mês
    if (year === currentYear) {
      return Number(month) > currentMonth;
    }
    
    // Se o ano for menor que o atual, não está no futuro
    return false;
  };

  // Função reutilizável para criar o modal de agendar reprocessamento
  const createRecalcModalContent = (
    month: MonthKey,
    year: number,
    taxValue: number | null,
    remainingRecalculations: number,
    onConfirm: () => void,
    onClose: () => void
  ): React.ReactNode => {
    return remainingRecalculations > 0 ? (
      <Alert
        onClose={onClose}
        disabledConfirm={remainingRecalculations === 0 || remainingRecalculations < 1}
        onConfirm={onConfirm}
        type="warning"
      >
        <div className="flex flex-col gap-2 text-center">
          <p>
            Confirmar recalculo para o mês de{" "}
            <u>
              {`${TranslatedMonthKeys[month]} de ${year}`}
            </u>{" "}
            com uma taxa de{" "}
            <u>{taxValue}%</u>?
          </p>
          <p>
            Seus pedidos neste período serão recalculados na opção{" "}
            <u className="font-bold">
              {user &&
              isMaster(user) &&
              user?.details.calc_tax
                ? FormatCalcTax(
                    user?.details.calc_tax
                  )
                : "N/A"}
            </u>
            .
          </p>
          <p>
            Você tem{" "}
            <u className="font-bold">
              {`${remainingRecalculations}`}
            </u>{" "}
            recalculos restantes.
          </p>
        </div>
      </Alert>
    ) : (
      <Alert type="error">
        <div className="flex flex-col gap-2 text-center">
          <p>
            Você não tem recalculos restantes.
          </p>
        </div>
      </Alert>
    );
  };
  const handleUpsert = async () => {
    if (!selectedAccount?.marketplace_shop_id) return;
    if (selectedTax === null) return;
    if (selectedTax < 0 || selectedTax > 100) {
      toast.error("A alíquota deve ser um número entre 0 e 100");
      return;
    }
    const p = upsert.mutateAsync({
      marketplace_shop_id: selectedAccount?.marketplace_shop_id ?? "",
      marketplace_type: selectedAccount?.marketplace_type as MarketplaceType,
      year: year.toString(),
      month: selectedMonth,
      tax_rate: selectedTax?.toString() ?? "",
    });
    toast.promise(p, {
      loading: "Salvando...",
      success: "Alíquota salva",
      error: (err: ApiResponse<unknown>) =>
        err?.message || "Erro ao salvar alíquota",
    });
    await p;
    
    // Aguarda a invalidação das queries e refaz a busca dos dados atualizados
    await queryClient.refetchQueries({
      queryKey: [
        "taxes",
        selectedAccount?.marketplace_shop_id,
        selectedAccount?.marketplace_type,
        year,
      ],
    });
    
    // Aguarda um pequeno delay para garantir que os dados foram atualizados
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Verifica se já existe reprocessamento agendado para o período
    // Usa os dados atualizados do cache
    const updatedTaxes = queryClient.getQueryData([
      "taxes",
      selectedAccount?.marketplace_shop_id,
      selectedAccount?.marketplace_type,
      year,
    ]) as typeof taxes | undefined;
    
    const currentTax = updatedTaxes?.impostos?.[selectedMonth];
    const isScheduledToRecalc = currentTax?.scheduled_to_recalculate ?? false;
    const isFuturePeriod = isPeriodInFuture(selectedMonth, year);
    
    // Só abre o modal de agendar reprocessamento se não houver reprocessamento agendado e não for período futuro
    if (!isScheduledToRecalc && !isFuturePeriod && updatedTaxes && selectedTax !== null) {
      openModal(
        createRecalcModalContent(
          selectedMonth,
          year,
          selectedTax,
          updatedTaxes.remaining_recalculations,
          () => {
            confirmRecalc(
              selectedMonth,
              year,
              updatedTaxes.remaining_recalculations
            );
          },
          closeModal
        ),
        {
          title: "Agendar recálculo para o período",
        }
      );
    }
  };
  const confirmRecalc = async (
    month: string,
    year: number,
    recalc_remaining: number
  ) => {
    if (recalc.isPending) return;
    if (!year || !selectedMonth || recalc_remaining === 0) return;
    const p = recalc.mutateAsync({
      year: year,
      month: Number(month),
      marketplace_shop_id: selectedAccount?.marketplace_shop_id ?? "",
      marketplace_type: selectedAccount?.marketplace_type as MarketplaceType,
    });
    toast.promise(p, {
      loading: "Iniciando recálculo...",
      success: (res: ApiResponse<unknown>) =>
        res?.message || "Recálculo iniciado",
      error: (err: ApiResponse<unknown>) =>
        err?.message || "Erro ao iniciar recálculo",
    });
    const result = await p;
    
    // Se o recálculo foi bem-sucedido (status 200), atualiza o cache manualmente
    if (result.success && selectedAccount?.marketplace_shop_id) {
      queryClient.setQueryData(
        [
          "taxes",
          selectedAccount.marketplace_shop_id,
          selectedAccount.marketplace_type,
          year,
        ],
        (oldData: typeof taxes | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            impostos: {
              ...oldData.impostos,
              [month]: {
                ...oldData.impostos[month as MonthKey],
                scheduled_to_recalculate: true,
              },
            },
            remaining_recalculations: Math.max(0, (oldData.remaining_recalculations ?? 0) - 1),
          };
        }
      );
    }
    
    closeModal();
  };
  function ErrorContent({
    title,
    description,
    image,
  }: {
    title: string;
    description: string;
    image: string;
  }) {
    return (
      <Paper>
        <h2 className="text-center mb-4 text-beergam-primary">{title}</h2>
        <p className="text-center mb-4">{description}</p>
        <img
          className="w-full h-full max-w-48 max-h-48 object-contain"
          src={image}
          alt={title}
        />
      </Paper>
    );
  }
  if (!isMaster(user))
    return (
      <>
        <ErrorContent
          title="Fora de Serviço"
          description={`Implementação para colaboradores ainda não criada.`}
          image={CDN_IMAGES.LARA_WORKER}
        />
      </>
    );
  if (user?.details.calc_tax === null)
    return (
      <>
        <ErrorContent
          title="Configure o Cálculo de Imposto"
          description="Configure o Cálculo de Imposto na sessão de 'Minha Conta' para acessar."
          image={CDN_IMAGES.LARA_CONFUSED}
        />
      </>
    );
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <Section
          title="Marketplaces"
          className="bg-beergam-mui-paper! md:min-w-[220px] md:max-w-[250px] md:w-[30%] w-full h-fit"
        >
          <div className="flex flex-col gap-2">
            <UserFields
              label="Pesquisar contas"
              name="marketplace"
              placeholder="Digite o nome da conta"
              canAlter={true}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {filteredAccounts && filteredAccounts?.length > 0 ? (
              filteredAccounts?.map((account) => (
                <button
                  key={account.marketplace_shop_id}
                  className={`border relative flex flex-col items-start w-full rounded-md p-2 ${selectedAccount?.marketplace_shop_id === account.marketplace_shop_id ? "bg-beergam-primary" : "hover:bg-beergam-primary/10 bg-beergam-section-background! border-beergam-input-border"}`}
                  onClick={() => handleMarketplaceSelect(account)}
                >
                  <div className="flex size-8 min-w-8 min-h-8 items-center justify-center gap-2 border-beergam-gray text-beergam-white rounded-full p-[2px] absolute top-1/2 -translate-y-1/2 right-2">
                    <img
                      src={getMarketplaceImageUrl(account.marketplace_type)}
                      alt={account.marketplace_name}
                      className="size-full h-full w-full object-contain"
                    />
                    {/* <p>{MarketplaceTypeLabel[account.marketplace_type]}</p> */}
                  </div>
                  <p className={`${selectedAccount?.marketplace_shop_id === account.marketplace_shop_id ? "text-beergam-white!" : "text-beergam-typography-tertiary!"}`}>{account.marketplace_name}</p>
                  {/* <div>{MarketplaceTypeLabel[account.marketplace_type]}</div> */}
                </button>
              ))
            ) : (
              <div><p>Nenhuma conta encontrada</p></div>
            )}
          </div>
        </Section>
        <Section
          title="Alíquotas"
          className="bg-beergam-mui-paper! md:max-w-[70%] w-full"
        >
          {/* Seção de Configurações de Imposto */}
          <div
          className="flex flex-col gap-4 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UserFields
                label="Cálculo de Imposto"
                name="calc_tax"
                value={calcTax ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setCalcTax(value);
                  }
                }}
                canAlter={true}
                options={Object.keys(CalcTax).map((key) => ({
                  value: key,
                  label: CalcTax[key as keyof typeof CalcTax],
                }))}
              />
              <UserFields
                label="Cálculo Fixo de Imposto (%)"
                name="tax_percent_fixed"
                value={taxPercentFixed ?? ""}
                onChange={(e) => setTaxPercentFixed(e.target.value || null)}
                canAlter={calcTax === "VALOR_PORCENTAGEM_FIXA"}
                type="number"
                min={0}
                max={100}
              />
            </div>
            <div>
              <BeergamButton
                title="Salvar Informações de Imposto"
                mainColor="beergam-primary"
                animationStyle="slider"
                disabled={!hasChanges}
                fetcher={{
                  fecthing: updateUserTaxSettings.isPending,
                  completed: updateUserTaxSettings.isSuccess,
                  error: updateUserTaxSettings.isError,
                  mutation: updateUserTaxSettings,
                }}
                onClick={() => {
                  updateUserTaxSettings.mutate({
                    calc_tax: calcTax,
                    tax_percent_fixed: taxPercentFixed,
                  });
                }}
              />
            </div>
          </div>
          
          {selectedAccount ? (
            <>
              <div className="flex flex-col md:flex-row items-center gap-2 bg-beergam-yellow/10 rounded-md p-2 mb-4">
                <Svg.alert
                  width="20px"
                  height="20px"
                  tailWindClasses="text-beergam-yellow"
                />
                <p>
                  Meses sem a alíquota preenchida terão seu valor calculado com
                  base na alíquota do mês anterior mais próximo com um valor
                  definido.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid md:grid-cols-3 gap-2">
                  <UserFields
                    label="Mês"
                    name="month"
                    value={selectedMonth}
                    options={MonthKeys.map((month: MonthKey) => ({
                      value: month,
                      label: TranslatedMonthKeys[month],
                    }))}
                    onChange={(e) =>
                      setSelectedMonth(e.target.value as MonthKey)
                    }
                    canAlter={true}
                  />
                  <UserFields
                    label="Ano"
                    name="year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    canAlter={true}
                    options={AVAILABLE_YEARS.map((year) => ({
                      value: year.toString(),
                      label: year.toString(),
                    }))}
                  />
                  <UserFields
                    label="Valor"
                    name="tax"
                    value={selectedTax ?? ""}
                    onChange={(e) => {
                      setSelectedTax(Number(e.target.value))
                    }}
                    canAlter={true}
                    type="number"
                    min={0}
                  />
                </div>
                <BeergamButton
                  title={
                    getTaxValue(
                      taxes?.impostos?.[selectedMonth]?.tax ?? null
                    ) !== null
                      ? "Atualizar Alíquota"
                      : "Adicionar Alíquota"
                  }
                  mainColor="beergam-primary"
                  animationStyle="slider"
                  icon={
                    getTaxValue(
                      taxes?.impostos?.[selectedMonth]?.tax ?? null
                    ) !== null
                      ? "pencil_solid"
                      : "plus"
                  }
                  fetcher={{
                    fecthing: upsert.isPending,
                    completed: upsert.isSuccess,
                    error: upsert.isError,
                    mutation: upsert,
                  }}
                  onClick={() => {
                    handleUpsert();
                  }}
                />
                {taxesLoading ? (
                  <div>
                    <Spining size="20px" />
                  </div>
                ) : (
                  <div className="grid md:flex flex-col gap-2 md:max-h-[50vh] overflow-y-scroll">
                    {Object.entries(taxes?.impostos ?? {})
                      .filter(
                        ([, tax]) =>
                          tax !== null &&
                          tax !== undefined &&
                          getTaxValue(tax.tax ?? null) !== null
                      )
                      .map(([month, tax]) => {
                        const taxValue = getTaxValue(tax?.tax ?? null) ?? null;
                        const isScheduledToRecalc = tax?.scheduled_to_recalculate ?? false;
                        return (
                          <div
                            key={month}
                            className={`${selectedMonth === month && year === year ? "bg-beergam-primary/10" : "bg-beergam-section-background! hover:bg-beergam-section-background/40! hover:border-beergam-input-border"} cursor-pointer border border-beergam-input-border/20 p-2 rounded-md flex flex-col md:flex-row items-center gap-2 justify-between`}
                            onClick={() => {
                              setSelectedTax(taxValue);
                              setSelectedMonth(month as MonthKey);
                              setYear(year);
                            }}
                          >
                            <div className="flex flex-col md:flex-row items-center gap-2">
                              <div
                                className={`size-7 flex justify-center items-center ${taxValue !== null ? "bg-beergam-blue-primary/10" : "bg-beergam-yellow/10"} rounded-full`}
                              >
                                {taxValue !== null ? (
                                  <Svg.check
                                    width="16px"
                                    height="16px"
                                    tailWindClasses="text-beergam-primary"
                                  />
                                ) : (
                                  <Svg.alert
                                    width="16px"
                                    height="16px"
                                    tailWindClasses="text-beergam-yellow"
                                  />
                                )}
                              </div>
                              <p>
                                {TranslatedMonthKeys[month as MonthKey]} de{" "}
                                {year}
                              </p>
                              {taxValue !== null ? (
                                <p>{`${taxValue}%`}</p>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2">
                              {taxValue !== null && taxValue !== undefined && (
                                <>
                                  {!isScheduledToRecalc ? (
                                    <BeergamButton
                                    animationStyle="slider"
                                    icon="arrow_path"
                                    tooltip={{
                                      id: `recalc-${month}`,
                                      content: isPeriodInFuture(month as MonthKey, year) 
                                        ? "Não é possível agendar recálculo para períodos futuros"
                                        : "Agendar recálculo para o período",
                                    }}
                                    disabled={isPeriodInFuture(month as MonthKey, year)}
                                    onClick={() => {
                                      if (taxValue === null || !taxes) return;
                                      const isFuturePeriod = isPeriodInFuture(month as MonthKey, year);
                                      if (isFuturePeriod) return;
                                      openModal(
                                        createRecalcModalContent(
                                          month as MonthKey,
                                          year,
                                          taxValue,
                                          taxes.remaining_recalculations,
                                          () => {
                                            confirmRecalc(
                                              month,
                                              year,
                                              taxes.remaining_recalculations
                                            );
                                          },
                                          closeModal
                                        ),
                                        {
                                          title: "Agendar recálculo para o período",
                                        }
                                      );
                                    }}
                                  />
                                  ) :<div className="flex items-center gap-2">
                                  <Loading size="16px" />
                                  <Hint message="O recálculo foi agendado e os pedidos serão reprocessados de madrugada." anchorSelect={`recalc-scheduled-${month}`} /> </div>}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div><h3 className="font-bold! text-beergam-typography-tertiary">Seleciona uma conta para ver as alíquotas</h3></div>
          )}
        </Section>
      </div>
    </>
  );
}
