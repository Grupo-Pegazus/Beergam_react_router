import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import dayjs from "dayjs";
import DailyRevenueChart from "~/features/vendas/components/Charts/DailyRevenueChart";
import GeographicMap from "~/features/vendas/components/Charts/GeographicMap";
import MetricasCards from "~/features/vendas/components/MetricasCards/MetricasCards";
import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";

import type { VendasFiltersState } from "~/features/vendas/components/Filters";
import { VendasFilters } from "~/features/vendas/components/Filters";
import { FilterDateRangePicker } from "~/src/components/filters";
import OrderList from "~/features/vendas/components/OrderList/OrderList";
import { useReprocessOrdersByPeriod, useVendasFilters, useCreateExport } from "~/features/vendas/hooks";
import AlertComponent from "~/src/components/utils/Alert";
import BeergamButton from "~/src/components/utils/BeergamButton";
import {
  CensorshipWrapper,
  ImageCensored,
} from "~/src/components/utils/Censorship";
import { useModal } from "~/src/components/utils/Modal/useModal";
import toast from "~/src/utils/toast";
import ExportHistoryModal from "~/features/vendas/components/ExportHistoryModal/ExportHistoryModal";
import type { DeliveryStatusFilter } from "~/features/vendas/components/Filters/types";
import { dateStringToISO } from "~/src/utils/date";

type ReprocessOrdersByPeriodModalProps = {
  onConfirm: (params: { date_from: string; date_to: string }) => void;
  onClose: () => void;
  isLoading?: boolean;
};

function ReprocessOrdersByPeriodModal({
  onConfirm,
  onClose,
}: ReprocessOrdersByPeriodModalProps) {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const handleConfirm = useCallback(() => {
    if (!dateFrom || !dateTo) {
      toast.error("Preencha as duas datas para reprocessar.");
      return;
    }

    onConfirm({ date_from: dateFrom, date_to: dateTo });
  }, [dateFrom, dateTo, onConfirm]);

  return (
    <AlertComponent
      type="warning"
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText="Reprocessar"
      cancelText="Cancelar"
    >
      <h3 className="font-semibold text-lg mb-2">
        Reprocessar pedidos pelo período
      </h3>
      <p className="text-sm text-gray-600 mb-2">
        Informe o período (data de fechamento) para reprocessar os pedidos.
      </p>
      <div className="mt-3">
        <FilterDateRangePicker
          label="Período de fechamento"
          value={dateFrom && dateTo ? { start: dateFrom, end: dateTo } : null}
          onChange={({ start, end }) => { setDateFrom(start); setDateTo(end); }}
          widthType="full"
        />
      </div>
    </AlertComponent>
  );
}

export default function VendasPage() {
  const [searchParams] = useSearchParams();
  const { filters, setFilters, resetFilters, apiFilters, filtersForExport, applyFilters } =
    useVendasFilters();
  const reprocessByPeriodMutation = useReprocessOrdersByPeriod();
  const createExportMutation = useCreateExport();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const deliveryStatusFilter = searchParams.get("deliveryStatusFilter") as DeliveryStatusFilter | null;
    if (deliveryStatusFilter) {
      const filtersFromUrl: VendasFiltersState = {
        ...filters,
        deliveryStatusFilter,
        shipment_status: deliveryStatusFilter,
      };
      setFilters(filtersFromUrl);
      applyFilters(filtersFromUrl);

      const scrollTimer = setTimeout(() => {
        const pedidosSection = document.getElementById("pedidos-section");
        if (pedidosSection) {
          pedidosSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);

      return () => clearTimeout(scrollTimer);
    }
  }, []);

  const handleFiltersChange = useCallback(
    (next: VendasFiltersState) => {
      setFilters(next);
    },
    [setFilters]
  );

  const handleReprocessByPeriodClick = useCallback(() => {
    openModal(
      <ReprocessOrdersByPeriodModal
        onClose={closeModal}
        onConfirm={({ date_from, date_to }) => {
          reprocessByPeriodMutation.mutate(
            { date_from, date_to },
            {
              onSettled: () => {
                closeModal();
              },
            },
          );
        }}
      />,
      { title: "Confirmar reprocessamento" },
    );
  }, [openModal, closeModal, reprocessByPeriodMutation]);

  const handleExportClick = useCallback(() => {
    createExportMutation.mutate(filtersForExport);
  }, [filtersForExport, createExportMutation]);

  const handleExportHistoryClick = useCallback(() => {
    openModal(<ExportHistoryModal onClose={closeModal} />, {
      title: "Histórico de Exportações",
      icon: "clock",
    });
  }, [openModal, closeModal]);

  const handleApplyFilterAndScroll = useCallback(
    (deliveryStatusFilter: DeliveryStatusFilter, periodDays: number) => {
      // Calcula as datas baseado no período selecionado
      const today = dayjs().endOf("day");
      const dateFrom = periodDays === 0 
        ? today.startOf("day")
        : today.subtract(periodDays, "day").startOf("day");
      
      const dateFromISO = dateStringToISO(dateFrom.format("YYYY-MM-DD"));
      const dateToISO = dateStringToISO(today.format("YYYY-MM-DD"));

      const newFilters: VendasFiltersState = {
        ...filters,
        deliveryStatusFilter,
        shipment_status: deliveryStatusFilter,
        dateCreatedFrom: dateFromISO,
        date_created_from: dateFromISO,
        dateCreatedTo: dateToISO,
        date_created_to: dateToISO,
      };
      setFilters(newFilters);
      applyFilters(newFilters);

      // Scroll suave até a seção de pedidos
      setTimeout(() => {
        const pedidosSection = document.getElementById("pedidos-section");
        if (pedidosSection) {
          pedidosSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    [filters, setFilters, applyFilters]
  );

  return (
    <>
      <CensorshipWrapper controlChildren censorshipKey="vendas_resumo">
        <Section
          title="Resumo"
        >
          <Grid cols={{ base: 1 }}>
            <MetricasCards onStatusCardClick={handleApplyFilterAndScroll} />
          </Grid>
        </Section>
      </CensorshipWrapper>
      <CensorshipWrapper censorshipKey="vendas_faturamento_diario">
        <Section
          title="Faturamento Diário e Logística"
        >
          <Grid cols={{ base: 1 }}>
            <ImageCensored
              className="w-full h-full min-h-56"
              censorshipKey="vendas_faturamento_diario"
            >
              <DailyRevenueChart />
            </ImageCensored>
          </Grid>
        </Section>
      </CensorshipWrapper>

      <CensorshipWrapper censorshipKey="vendas_distribuicao_geografica">
        <Section title="Distribuição Geográfica">
            <ImageCensored
              className="w-max-w-screen h-full min-h-56"
              censorshipKey="vendas_distribuicao_geografica"
            >
              <GeographicMap period="last_90_days" />
            </ImageCensored>
        </Section>
      </CensorshipWrapper>
      <CensorshipWrapper censorshipKey="vendas_orders_list" controlChildren>
        <div id="pedidos-section">
          <Section title="Pedidos">
            <div className="flex flex-col md:flex-row justify-end gap-2 mb-4">
            <BeergamButton
              title="Histórico de Exportações"
              mainColor="beergam-blue"
              icon="clock"
              onClick={handleExportHistoryClick}
            />
            <BeergamButton
              title="Exportar Planilha"
              mainColor="beergam-green"
              icon="excel"
              onClick={handleExportClick}
              disabled={createExportMutation.isPending}
              loading={createExportMutation.isPending}
            />
            <BeergamButton
              title="Reprocessar pedidos pelo período"
              mainColor="beergam-orange"
              animationStyle="slider"
              onClick={handleReprocessByPeriodClick}
              disabled={reprocessByPeriodMutation.isPending}
              loading={reprocessByPeriodMutation.isPending}
            />
          </div>
          <VendasFilters
            value={filters}
            onChange={handleFiltersChange}
            onReset={resetFilters}
            onSubmit={() => applyFilters(filters)}
          />
          <OrderList filters={apiFilters} syncPageWithUrl />
          </Section>
        </div>
      </CensorshipWrapper>
    </>
  );
}
