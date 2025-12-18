import { useState } from "react";
import Section from "~/src/components/ui/Section";
import Grid from "~/src/components/ui/Grid";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { SchedulingFilters } from "~/features/agendamentos/components/Filters";
import { SchedulingList } from "~/features/agendamentos/components/SchedulingList";
import type { SchedulingFilters as SchedulingFiltersType, Scheduling } from "~/features/agendamentos/typings";
import SchedulingFormModal from "~/features/agendamentos/components/SchedulingFormModal/SchedulingFormModal";
import { SchedulingDetailsModal } from "~/features/agendamentos/components/SchedulingDetailsModal";
import SchedulingCancelModal from "~/features/agendamentos/components/SchedulingCancelModal/SchedulingCancelModal";
import { SchedulingReceiptModal } from "~/features/agendamentos/components/SchedulingReceiptModal";
import { SchedulingLogsModal } from "~/features/agendamentos/components/SchedulingLogsModal";

export default function AgendamentoPage() {
  const [filters, setFilters] = useState<Partial<SchedulingFiltersType>>({
    page: 1,
    per_page: 10,
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScheduling, setEditingScheduling] = useState<Scheduling | null>(null);
  const [viewingSchedulingId, setViewingSchedulingId] = useState<string | null>(null);
  const [cancellingSchedulingId, setCancellingSchedulingId] = useState<string | null>(null);
  const [receivingSchedulingId, setReceivingSchedulingId] = useState<string | null>(null);
  const [logsSchedulingId, setLogsSchedulingId] = useState<string | null>(null);

  return (
    <>
      <Section title="Gerenciamento de Agendamentos">
        <div className="mb-4">
          <p className="text-slate-600">
            Veja e gerencie todos os agendamentos de estoque realizados em um único lugar.
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <BeergamButton
            title="Novo Agendamento"
            mainColor="beergam-orange"
            animationStyle="slider"
            onClick={() => setShowCreateModal(true)}
          />
        </div>

        <Grid cols={{ base: 1, lg: 1 }}>
          <SchedulingFilters
            value={filters}
            onChange={setFilters}
          />

          <SchedulingList
            filters={filters}
            onView={(id) => setViewingSchedulingId(id)}
            onEdit={(id) => setViewingSchedulingId(id)}
            onCancel={(id) => setCancellingSchedulingId(id)}
            onReceive={(id) => setReceivingSchedulingId(id)}
          />
        </Grid>
      </Section>

      <SchedulingFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <SchedulingFormModal
        isOpen={!!editingScheduling}
        onClose={() => setEditingScheduling(null)}
        scheduling={editingScheduling || undefined}
      />

      <SchedulingDetailsModal
        isOpen={!!viewingSchedulingId}
        onClose={() => setViewingSchedulingId(null)}
        schedulingId={viewingSchedulingId}
        onEdit={(scheduling) => {
          setViewingSchedulingId(null);
          setEditingScheduling(scheduling);
        }}
        onCancel={(scheduling) => {
          setViewingSchedulingId(null);
          setCancellingSchedulingId(scheduling.id);
        }}
        onReceive={(scheduling) => {
          setViewingSchedulingId(null);
          setReceivingSchedulingId(scheduling.id);
        }}
        onViewLogs={(id) => {
          setViewingSchedulingId(null);
          setLogsSchedulingId(id);
        }}
      />

      <SchedulingCancelModal
        isOpen={!!cancellingSchedulingId}
        onClose={() => setCancellingSchedulingId(null)}
        schedulingId={cancellingSchedulingId}
      />

      <SchedulingReceiptModal
        isOpen={!!receivingSchedulingId}
        onClose={() => setReceivingSchedulingId(null)}
        schedulingId={receivingSchedulingId}
      />

      <SchedulingLogsModal
        isOpen={!!logsSchedulingId}
        onClose={() => setLogsSchedulingId(null)}
        schedulingId={logsSchedulingId}
      />
    </>
  );
}
