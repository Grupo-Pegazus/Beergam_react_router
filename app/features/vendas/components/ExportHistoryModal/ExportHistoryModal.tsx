import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { useExportHistory, useExportStatus } from "../../hooks";
import type { ExportJob } from "../../typings";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
import toast from "~/src/utils/toast";

interface ExportHistoryModalProps {
  onClose: () => void;
}

function ExportJobItem({ job }: { job: ExportJob }) {
  const { data: statusData, isLoading: isLoadingStatus } = useExportStatus(
    job.status === "pending" || job.status === "processing" ? job.job_id : null
  );

  const currentJob = statusData?.success ? statusData.data : job;

  const statusConfig = useMemo(() => {
    switch (currentJob.status) {
      case "pending":
        return {
          label: "Pendente",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "processing":
        return {
          label: "Processando",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "completed":
        return {
          label: "Concluído",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "failed":
        return {
          label: "Falhou",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          label: "Desconhecido",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  }, [currentJob.status]);

  const handleDownload = useCallback(() => {
    if (currentJob.file_url) {
      window.open(currentJob.file_url, "_blank");
    } else {
      toast.error("Arquivo ainda não está disponível");
    }
  }, [currentJob.file_url]);

  const handleCopyLink = useCallback(() => {
    if (currentJob.file_url) {
      navigator.clipboard.writeText(currentJob.file_url);
      toast.success("Link copiado para a área de transferência");
    }
  }, [currentJob.file_url]);

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            {isLoadingStatus && (
              <span className="text-xs text-gray-500">Atualizando...</span>
            )}
          </div>
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <div>
              <span className="font-medium">Criado em:</span>{" "}
              {dayjs(currentJob.created_at).format("DD/MM/YYYY HH:mm")}
            </div>
            {currentJob.completed_at && (
              <div>
                <span className="font-medium">Concluído em:</span>{" "}
                {dayjs(currentJob.completed_at).format("DD/MM/YYYY HH:mm")}
              </div>
            )}
            {currentJob.rows_written !== undefined && (
              <div>
                <span className="font-medium">Linhas exportadas:</span>{" "}
                {currentJob.rows_written.toLocaleString("pt-BR")}
              </div>
            )}
            {currentJob.filename && (
              <div>
                <span className="font-medium">Arquivo:</span> {currentJob.filename}
              </div>
            )}
            {currentJob.error_message && (
              <div className="text-red-600 mt-1">
                <span className="font-medium">Erro:</span> {currentJob.error_message}
              </div>
            )}
          </div>
        </div>
        {currentJob.status === "completed" && currentJob.file_url && (
          <div className="flex flex-col gap-2">
            <BeergamButton
              title="Baixar"
              icon="box_arrow_down_solid"
              mainColor="beergam-green"
              onClick={handleDownload}
            />
            <BeergamButton
              title="Copiar Link"
              icon="copy"
              mainColor="beergam-blue"
              onClick={handleCopyLink}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExportHistoryModal({ onClose }: ExportHistoryModalProps) {
  const { data, isLoading, error, refetch } = useExportHistory(20);

  const jobs = useMemo(() => {
    if (!data?.success || !data.data?.jobs) return [];
    return data.data.jobs;
  }, [data]);

  return (
    <div className="flex flex-col gap-4 max-h-[80vh]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-beergam-typography-primary">
          Histórico de Exportações
        </h3>
        <BeergamButton
          title="Atualizar"
          icon="arrow_path"
          mainColor="beergam-blue"
          onClick={() => refetch()}
        />
      </div>

      <AsyncBoundary
        isLoading={isLoading}
        error={error as unknown}
        Skeleton={() => (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}
        ErrorFallback={() => (
          <div className="rounded-2xl border border-red-200 bg-red-50 text-red-700 p-4">
            Não foi possível carregar o histórico de exportações.
          </div>
        )}
      >
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Svg.information_circle
              tailWindClasses="h-12 w-12 text-gray-400 mb-3"
            />
            <p className="text-sm text-gray-600">
              Nenhuma exportação encontrada.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Crie uma exportação para ver o histórico aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto pr-2">
            {jobs.map((job) => (
              <ExportJobItem key={job.job_id} job={job} />
            ))}
          </div>
        )}
      </AsyncBoundary>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <BeergamButton
          title="Fechar"
          onClick={onClose}
          mainColor="beergam-gray"
        />
      </div>
    </div>
  );
}
