import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import type { ApiResponse } from "~/features/apiClient/typings";
import { marketplaceService } from "~/features/marketplace/service";
import type {
  BaseMarketPlace,
  MarketplaceType,
} from "~/features/marketplace/typings";
import {
  useRecalcStatus,
  useRecalculatePeriod,
  useUpsertTax,
  useUserTaxes,
} from "~/features/taxes/hooks";
import {
  MonthKeys,
  TranslatedMonthKeys,
  type MonthKey,
} from "~/features/taxes/typings";
import UserFields from "~/features/user/components/UserFields";
import Spining from "~/src/assets/loading";
import Svg from "~/src/assets/svgs/_index";
import Section from "~/src/components/ui/Section";
import Alert from "~/src/components/utils/Alert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useModal } from "~/src/components/utils/Modal/useModal";
import { getMarketplaceImageUrl } from "~/src/constants/cdn-images";
const AVAILABLE_YEARS = [2025, 2024];
export default function Impostos() {
  const recalc = useRecalculatePeriod();
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
    taxes?.impostos?.[selectedMonth] ?? null
  );
  useEffect(() => {
    setSelectedTax(taxes?.impostos?.[selectedMonth] ?? null);
  }, [selectedMonth, taxes]);
  const recalcStatus = useRecalcStatus({
    year: year,
    month: Number(selectedMonth),
  });
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
  };
  const confirmRecalc = async (month: string, year: number) => {
    if (!recalcStatus.data?.can_recalculate) return;
    if (recalcStatus.data?.remaining_recalculations === 0) return;
    if (recalc.isPending) return;
    if (!year || !selectedMonth) return;
    const p = recalc.mutateAsync({
      year: year,
      month: Number(month),
    });
    toast.promise(p, {
      loading: "Iniciando recálculo...",
      success: (res: ApiResponse<unknown>) =>
        res?.message || "Recálculo iniciado",
      error: (err: ApiResponse<unknown>) =>
        err?.message || "Erro ao iniciar recálculo",
    });
    await p;
    closeModal();
  };
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <Section
          title="Marketplaces"
          className="bg-beergam-white md:min-w-[220px] md:max-w-[250px] md:w-[30%] w-full h-fit"
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
                  className={`border relative flex flex-col items-start border-beergam-blue-primary w-full rounded-md p-2 ${selectedAccount?.marketplace_shop_id === account.marketplace_shop_id ? "bg-beergam-blue-primary text-beergam-white" : "text-beergam-blue-primary hover:bg-beergam-blue-primary/10"}`}
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
                  <p>{account.marketplace_name}</p>
                  {/* <div>{MarketplaceTypeLabel[account.marketplace_type]}</div> */}
                </button>
              ))
            ) : (
              <div>Nenhuma conta encontrada</div>
            )}
          </div>
        </Section>
        <Section
          title="Alíquotas"
          className="bg-beergam-white md:max-w-[70%] w-full"
        >
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
                <div className="grid grid-cols-3 gap-2">
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
                    onChange={(e) => setSelectedTax(Number(e.target.value))}
                    canAlter={true}
                    type="number"
                  />
                </div>
                <BeergamButton
                  title={
                    taxes?.impostos?.[selectedMonth] !== 0
                      ? "Atualizar Alíquota"
                      : "Adicionar Alíquota"
                  }
                  mainColor="beergam-blue-primary"
                  animationStyle="slider"
                  icon={
                    taxes?.impostos?.[selectedMonth] !== 0
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
                    //   upsert.mutate({
                    //     marketplace_shop_id: selectedAccount?.marketplace_shop_id,
                    //     marketplace_type:
                    //       selectedAccount?.marketplace_type as MarketplaceType,
                    //     year: year.toString(),
                    //     month: selectedMonth,
                    //     tax_rate: selectedTax?.toString() ?? "",
                    //   });
                    handleUpsert();
                  }}
                />
                {taxesLoading ? (
                  <div>
                    <Spining size="20px" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {Object.entries(taxes?.impostos ?? {})
                      .filter(
                        ([_month, tax]) =>
                          tax !== 0 && tax !== null && tax !== undefined
                      )
                      .map(([month, tax]) => (
                        <div
                          key={tax}
                          className={`${selectedMonth === month && year === year ? "bg-beergam-blue-primary/10" : "bg-beergam-white"} p-2 rounded-md flex items-center gap-2 justify-between`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="size-7 flex justify-center items-center bg-beergam-blue-primary/10 rounded-full">
                              <Svg.check
                                width="16px"
                                height="16px"
                                tailWindClasses="text-beergam-blue-primary"
                              />
                            </div>
                            <p>
                              {TranslatedMonthKeys[month]} de {year}
                            </p>
                            <p>{tax}%</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <BeergamButton
                              mainColor="beergam-blue-primary"
                              animationStyle="slider"
                              icon="arrow_path"
                              tooltip={{
                                id: `recalc-${month}`,
                                content: "Recalcular período",
                              }}
                              onClick={() => {
                                openModal(
                                  <Alert
                                    type="warning"
                                    onClose={closeModal}
                                    onConfirm={() => confirmRecalc(month, year)}
                                    disabledConfirm={
                                      recalcStatus.data
                                        ?.remaining_recalculations === 0
                                    }
                                  >
                                    <div className="flex flex-col gap-2">
                                      <p>
                                        Confirmar recalculo para o mês de{" "}
                                        <span className="font-bold underline">
                                          {`${TranslatedMonthKeys[month]} de ${year}`}
                                        </span>{" "}
                                        ?
                                      </p>
                                      <div
                                        className={`flex items-center justify-center border ${recalcStatus.data?.remaining_recalculations && recalcStatus.data?.remaining_recalculations <= 1 ? "border-beergam-red text-beergam-red" : "border-beergam-yellow text-beergam-yellow"} bg-beergam-yellow/10 rounded-full p-2`}
                                      >
                                        <h3>
                                          Recalculos Restantes:{" "}
                                          {recalcStatus.data
                                            ?.remaining_recalculations ?? 0}
                                        </h3>
                                      </div>
                                    </div>
                                  </Alert>,
                                  {
                                    title: "Recalcular período",
                                  }
                                );
                              }}
                            />
                            <BeergamButton
                              mainColor="beergam-blue-primary"
                              animationStyle="slider"
                              icon="pencil_solid"
                              onClick={() => {
                                setSelectedTax(tax);
                                setSelectedMonth(month as MonthKey);
                                setYear(year);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>Seleciona uma conta para ver as alíquotas</div>
          )}
        </Section>
      </div>
    </>
  );
}
