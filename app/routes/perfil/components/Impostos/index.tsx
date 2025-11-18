import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { MarketplaceType, type BaseMarketPlace, MarketplaceTypeLabel } from "~/features/marketplace/typings";
import { marketplaceService } from "~/features/marketplace/service";
import { useRecalcStatus, useRecalculatePeriod, useUpsertTax, useUserTaxes } from "~/features/taxes/hooks";
import type { TaxesData } from "~/features/taxes/typings";
import { TextField, MenuItem, Select, InputLabel, FormControl, Table, TableHead, TableRow, TableCell, TableBody, Button, Card, CardContent, CircularProgress, Box, Typography, InputAdornment, IconButton, Chip, Avatar } from "@mui/material";
import { Tooltip } from "react-tooltip";
import Modal from "~/src/components/utils/Modal";
import Svg from "~/src/assets/svgs/_index";
import Hint from "~/src/components/utils/Hint";
import type { ApiResponse } from "~/features/apiClient/typings";

function formatRateInput(value: string): string {
  const normalized = value.replace(/[^0-9.,]/g, "");
  const withDot = normalized.replace(",", ".");
  const parts = withDot.split(".");
  if (parts.length > 2) return `${parts[0]}.${parts.slice(1).join("")}`;
  if (parts[1]?.length > 2) return `${parts[0]}.${parts[1].slice(0, 2)}`;
  return withDot;
}

function sanitizePercentInput(value: string): string {
  // permite dígitos e um separador (vírgula OU ponto)
  let v = value.replace(/[^0-9.,]/g, "");

  const firstSepIdx = Math.min(
    ...([v.indexOf("."), v.indexOf(",")] as const).filter((i) => i !== -1)
  );
  if (Number.isFinite(firstSepIdx)) {
    const idx = firstSepIdx as number;
    const head = v.slice(0, idx + 1);
    const tail = v
      .slice(idx + 1)
      .replace(/[.,]/g, "")
      .slice(0, 2); // limita a 2 casas
    v = head + tail;
  } else {
    // nenhum separador: limita comprimento razoável
    v = v.slice(0, 8);
  }
  return v;
}

function formatNumberToPercentString(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n) || !Number.isFinite(n)) return "0,00";
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Impostos() {
  const [selectedAccount, setSelectedAccount] = useState<BaseMarketPlace | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [editRates, setEditRates] = useState<Record<string, string>>({});
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; month: number | null }>({ open: false, month: null });

  // Contas do usuário
  const accountsQuery = useQuery({
    queryKey: ["marketplaces-accounts"],
    queryFn: async () => {
      const res = await marketplaceService.getMarketplacesAccounts();
      if (!res.success) {
        const err = new Error(res.message || "Erro ao carregar contas");
        Object.assign(err, res);
        throw err;
      }
      return res.data as BaseMarketPlace[];
    },
  });

  const { data: taxes, isLoading: taxesLoading } = useUserTaxes({
    marketplace_shop_id: selectedAccount?.marketplace_shop_id,
    marketplace_type: selectedAccount?.marketplace_type as MarketplaceType | undefined,
    year,
  });

  const upsert = useUpsertTax();

  const handleSaveMonth = async (month: number) => {
    if (!selectedAccount) return;
    const raw = editRates[String(month)] ?? String(taxes?.impostos?.[String(month) as keyof TaxesData["impostos"]] ?? "0");
    const formatted = formatRateInput(raw);

    const payload = {
      marketplace_shop_id: String(selectedAccount.marketplace_shop_id),
      marketplace_type: selectedAccount.marketplace_type,
      year: String(year),
      month: String(month).padStart(2, "0"),
      tax_rate: formatted,
    };
    const p = upsert.mutateAsync(payload);
    toast.promise(p, {
      loading: "Salvando...",
      success: "Imposto salvo",
      error: "Erro ao salvar imposto",
    });
    await p;
    setEditRates((prev) => {
      const next = { ...prev };
      delete next[String(month)];
      return next;
    });
  };

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  useEffect(() => {
    setEditRates({});
  }, [selectedAccount?.marketplace_shop_id, selectedAccount?.marketplace_type, year]);

  const [recalcContext, setRecalcContext] = useState<{ year: number; month: number } | null>(null);
  const recalcStatus = useRecalcStatus({ year: recalcContext?.year, month: recalcContext?.month });
  const recalc = useRecalculatePeriod();

  const openRecalc = (month: number) => {
    setRecalcContext({ year, month });
    setConfirmModal({ open: true, month });
  };

  const confirmRecalc = async () => {
    if (!recalcContext) return;
    const p = recalc.mutateAsync({ year: recalcContext.year, month: recalcContext.month });
    toast.promise(p, {
      loading: "Iniciando recálculo...",
      success: (res: ApiResponse<unknown>) => res?.message || "Recálculo iniciado",
      error: (err: ApiResponse<unknown>) => err?.message || "Erro ao iniciar recálculo",
    });
    await p;
    setConfirmModal({ open: false, month: null });
  };

  const isReady = Boolean(selectedAccount);

  return (
    <div className="flex flex-col gap-6 md:mb-0 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormControl fullWidth>
          <InputLabel id="account-select-label">Conta</InputLabel>
          <Select
            labelId="account-select-label"
            label="Conta"
            value={selectedAccount?.marketplace_shop_id ?? ""}
            onChange={(e) => {
              const acc = accountsQuery.data?.find((a) => a.marketplace_shop_id === e.target.value);
              setSelectedAccount(acc ?? null);
            }}
          >
            {(accountsQuery.data ?? []).map((acc) => (
              <MenuItem key={`${acc.marketplace_type}-${acc.marketplace_shop_id}`} value={acc.marketplace_shop_id}>
                {acc.marketplace_name} ({MarketplaceTypeLabel[acc.marketplace_type as MarketplaceType]})
              </MenuItem>)
            )}
          </Select>
        </FormControl>

        <TextField
          label="Ano"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          inputProps={{ min: 1900, max: 3000 }}
          fullWidth
        />
      </div>

      {!isReady ? (
        <Card>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-beergam-blue-primary/10 p-3">
                <Svg.graph />
              </div>
              <div>
                <p className="text-beergam-blue-primary font-semibold">Selecione uma conta</p>
                <p className="text-sm text-beergam-black-blue/70">Escolha a conta e o ano para configurar as alíquotas mensais.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Box 
              display="flex" 
              flexDirection={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between" 
              mb={2}
              gap={2}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar src={selectedAccount?.marketplace_image} alt={selectedAccount?.marketplace_name} />
                <div className="min-w-0 flex-1">
                  <Typography variant="h6" className="truncate">{selectedAccount?.marketplace_name}</Typography>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Chip size="small" label={MarketplaceTypeLabel[selectedAccount?.marketplace_type as MarketplaceType]} color="primary" variant="outlined" />
                    <Chip size="small" label={`Ano ${year}`} />
                  </div>
                </div>
              </div>
              {taxesLoading && <CircularProgress size={20} />}
            </Box>
            
            {/* Desktop: Tabela */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Mês</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>Alíquota (%)</span>
                        <Hint message="Informe a alíquota do mês. Ex.: 1,25" anchorSelect="impostos-aliquota-hint" />
                      </div>
                    </TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {months.map((m) => {
                    const current = taxes?.impostos?.[String(m) as keyof TaxesData["impostos"]] ?? 0;
                    const fallback = formatNumberToPercentString(Number(current));
                    const value = editRates[String(m)] ?? fallback;
                    const disabledSave =
                      upsert.isPending ||
                      (editRates[String(m)] === undefined && Number(current) === Number(fallback.replace(',', '.')));
                    return (
                      <TableRow key={m}>
                        <TableCell>{String(m).padStart(2, "0")}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={value}
                            onChange={(e) => {
                              const next = sanitizePercentInput(e.target.value);
                              setEditRates((prev) => ({ ...prev, [String(m)]: next }));
                            }}
                            inputProps={{ inputMode: "decimal" }}
                            placeholder="0,00"
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            onBlur={(ev) => {
                              const raw = ev.target.value;
                              if (!raw) return;
                              const num = Number(raw.replace(",", "."));
                              if (Number.isFinite(num)) {
                                setEditRates((prev) => ({ ...prev, [String(m)]: formatNumberToPercentString(num) }));
                              }
                            }}
                            onFocus={() => {
                              // ao focar, se o valor for apenas o fallback formatado, mantém; se for editado, não força seleção
                              // comportamento natural de digitação funciona pois não reformatamos em onChange
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" gap={1} justifyContent="flex-end">
                            <IconButton
                              color="primary"
                              onClick={() => openRecalc(m)}
                              data-tooltip-id={`recalc-${m}`}
                            >
                              <Svg.arrow_path tailWindClasses="w-5 h-5" />
                            </IconButton>
                            <Tooltip id={`recalc-${m}`} content="Recalcular período" className="z-50" />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleSaveMonth(m)}
                              disabled={!selectedAccount || disabledSave}
                            >
                              <div className="flex items-center gap-1">
                                <Svg.check width={16} height={16} tailWindClasses="stroke-beergam-white" />
                                <span>Salvar</span>
                              </div>
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>

            {/* Mobile: Cards */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <div className="flex flex-col gap-3">
                {months.map((m) => {
                  const current = taxes?.impostos?.[String(m) as keyof TaxesData["impostos"]] ?? 0;
                  const fallback = formatNumberToPercentString(Number(current));
                  const value = editRates[String(m)] ?? fallback;
                  const disabledSave =
                    upsert.isPending ||
                    (editRates[String(m)] === undefined && Number(current) === Number(fallback.replace(',', '.')));
                  return (
                    <Card key={m} variant="outlined" className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Typography variant="subtitle1" fontWeight="bold">
                            Mês {String(m).padStart(2, "0")}
                          </Typography>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-beergam-black-blue/70">Alíquota (%)</span>
                            <Hint message="Informe a alíquota do mês. Ex.: 1,25" anchorSelect={`impostos-aliquota-hint-${m}`} />
                          </div>
                          <TextField
                            size="small"
                            value={value}
                            onChange={(e) => {
                              const next = sanitizePercentInput(e.target.value);
                              setEditRates((prev) => ({ ...prev, [String(m)]: next }));
                            }}
                            inputProps={{ inputMode: "decimal" }}
                            placeholder="0,00"
                            fullWidth
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            onBlur={(ev) => {
                              const raw = ev.target.value;
                              if (!raw) return;
                              const num = Number(raw.replace(",", "."));
                              if (Number.isFinite(num)) {
                                setEditRates((prev) => ({ ...prev, [String(m)]: formatNumberToPercentString(num) }));
                              }
                            }}
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                          <IconButton
                            color="primary"
                            onClick={() => openRecalc(m)}
                            data-tooltip-id={`recalc-mobile-${m}`}
                            size="small"
                          >
                            <Svg.arrow_path tailWindClasses="w-5 h-5" />
                          </IconButton>
                          <Tooltip id={`recalc-mobile-${m}`} content="Recalcular período" className="z-50" />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSaveMonth(m)}
                            disabled={!selectedAccount || disabledSave}
                          >
                            <div className="flex items-center gap-1">
                              <Svg.check width={16} height={16} tailWindClasses="stroke-beergam-white" />
                              <span>Salvar</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Box>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, month: null })}
        title="Confirmar recálculo"
        className="px-4"
        contentClassName="max-w-[560px]"
      >
        <div className="flex flex-col gap-4">
          <p>
            Confirmar recálculo do período {confirmModal.month}/{year}?
          </p>
          <Card>
            <CardContent>
              {recalcStatus.isLoading ? (
                <Box display="flex" alignItems="center" gap={8}>
                  <CircularProgress size={18} />
                  <span>Carregando status...</span>
                </Box>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${recalcStatus.data?.can_recalculate ? "bg-green-100" : "bg-red-100"}`}>
                      {recalcStatus.data?.can_recalculate ? (
                        <Svg.check tailWindClasses="stroke-beergam-green w-5 h-5" />
                      ) : (
                        <Svg.circle_x tailWindClasses="text-red-500 w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-beergam-black-blue/70">Recálculos restantes</p>
                      <p className="font-semibold">{recalcStatus.data?.remaining_recalculations ?? 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setConfirmModal({ open: false, month: null })}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={confirmRecalc}
              disabled={!recalcStatus.data?.can_recalculate || recalc.isPending}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


