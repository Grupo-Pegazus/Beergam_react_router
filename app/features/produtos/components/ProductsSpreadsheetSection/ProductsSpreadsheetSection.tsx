import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import ActivateStockModal from "~/features/produtos/components/ActivateStockModal";
import { produtosService } from "~/features/produtos/service";
import ReprocessOrdersBySkuModal from "~/features/vendas/components/ReprocessOrdersBySkuModal/ReprocessOrdersBySkuModal";
import { useSyncCostsBySku } from "~/features/vendas/hooks";
import Svg from "~/src/assets/svgs/_index";
import BeergamButton from "~/src/components/utils/BeergamButton";
import MainCards from "~/src/components/ui/MainCards";
import { useModal } from "~/src/components/utils/Modal/useModal";
import toast from "~/src/utils/toast";

const colorClasses = {
  "beergam-orange": {
    border: "hover:border-beergam-orange",
    iconBg: "bg-beergam-orange/10 group-hover:bg-beergam-orange/20",
    iconColor: "text-beergam-orange",
  },
  "beergam-blue-primary": {
    border: "hover:border-beergam-blue-primary",
    iconBg: "bg-beergam-blue-primary/10 group-hover:bg-beergam-blue-primary/20",
    iconColor: "text-beergam-blue-primary",
  },
  "beergam-green": {
    border: "hover:border-beergam-green",
    iconBg: "bg-beergam-green/10 group-hover:bg-beergam-green/20",
    iconColor: "text-beergam-green",
  },
} as const;

type CardColor = keyof typeof colorClasses;

function ActionCard({
  title,
  description,
  icon,
  mainColor,
  onClick,
  disabled,
  loading,
}: {
  title: string;
  description: string;
  icon: keyof typeof Svg;
  mainColor: CardColor;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const IconComponent = Svg[icon];
  const colors = colorClasses[mainColor];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled ?? loading}
      className={`group relative flex flex-col p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-beergam-input-border bg-beergam-section-background ${colors.border} hover:shadow-lg transition-all duration-200 text-left w-full disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div
          className={`p-2 sm:p-2.5 md:p-3 rounded-lg ${colors.iconBg} transition-colors`}
        >
          <IconComponent
            tailWindClasses={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${colors.iconColor}`}
          />
        </div>
        {loading && (
          <span className="text-xs text-beergam-typography-secondary">
            ...
          </span>
        )}
      </div>
      <Typography
        variant="h6"
        fontWeight={600}
        className="text-beergam-typography-primary mb-1 text-sm sm:text-base md:text-lg"
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        className="text-beergam-typography-secondary text-xs sm:text-sm leading-tight sm:leading-normal"
      >
        {description}
      </Typography>
    </button>
  );
}

export default function ProductsSpreadsheetSection() {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syncCostsBySkuMutation = useSyncCostsBySku();

  const templateMutation = useMutation({
    mutationFn: () => produtosService.getSpreadsheetTemplate(),
    onSuccess: (res) => {
      if (res.success && res.data?.file_url) {
        window.open(res.data.file_url, "_blank");
        toast.success("Planilha modelo gerada. O download deve abrir em instantes.");
      } else {
        toast.error(res.message ?? "Falha ao gerar planilha modelo.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Falha ao gerar planilha modelo.");
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => produtosService.exportSpreadsheet(),
    onSuccess: (res) => {
      if (res.success && res.data?.file_url) {
        window.open(res.data.file_url, "_blank");
        toast.success("Exportação concluída. O download deve abrir em instantes.");
      } else {
        toast.error(res.message ?? "Falha ao exportar planilha.");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Falha ao exportar planilha.");
    },
  });

  const activateStockMutation = useMutation({
    mutationFn: (skus: Array<{ sku: string; available_quantity: number }>) =>
      produtosService.activateStockHandling(skus),
    onSuccess: (res) => {
      if (res.success && res.data) {
        const { activated, skus_not_found, errors } = res.data;
        if (activated > 0) {
          toast.success(`Controle de estoque ativado para ${activated} produto(s).`);
        }
        if (skus_not_found.length > 0 || errors.length > 0) {
          const total = skus_not_found.length + errors.length;
          toast.warning(`${total} SKU(s) não puderam ser processados.`);
        }
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["products-metrics"] });
        queryClient.invalidateQueries({ queryKey: ["stock-dashboard"] });
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Falha ao ativar controle de estoque.");
    },
  });

  const importMutation = useMutation({
    mutationFn: (file: File) => produtosService.importSpreadsheet(file),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message ?? "Falha na importação.");
        return;
      }
      const data = res.data;
      if (!data) return;

      const { created, updated, skus, created_skus = [], errors } = data;
      const totalProcessed = created + updated;
      if (errors.length > 0) {
        toast.warning(
          `Importação concluída: ${totalProcessed} processado(s). ${errors.length} erro(s). Verifique os SKUs.`
        );
      } else {
        toast.success(
          `Importação concluída: ${created} criado(s), ${updated} atualizado(s).`
        );
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-metrics"] });

      const showReprocessModal = () => {
        if (skus.length > 0) {
          openModal(
            <ReprocessOrdersBySkuModal
              skus={skus}
              title="Importação concluída!"
              description="Deseja atualizar os custos dos pedidos para os SKUs da planilha?"
              cancelText="Não, fechar"
              onClose={() => closeModal()}
              onConfirm={(selectedSkus) => {
                syncCostsBySkuMutation.mutate(selectedSkus, {
                  onSettled: () => closeModal(),
                });
              }}
              isLoading={syncCostsBySkuMutation.isPending}
            />,
            { title: "Importação concluída!" }
          );
        }
      };

      if (created_skus.length > 0) {
        openModal(
          <ActivateStockModal
            createdSkus={created_skus}
            title="Produtos criados na importação"
            description="Deseja ativar o controle de estoque para os produtos criados? Selecione os SKUs desejados."
            cancelText="Não, fechar"
            onClose={() => {
              closeModal();
              showReprocessModal();
            }}
            onConfirm={(selected) => {
              activateStockMutation.mutate(selected, {
                onSettled: () => {
                  closeModal();
                  showReprocessModal();
                },
              });
            }}
            isLoading={activateStockMutation.isPending}
          />,
          { title: "Ativar controle de estoque?" }
        );
      } else {
        showReprocessModal();
      }
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Falha na importação da planilha.");
    },
  });

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      toast.error("Formato aceito: .xlsx");
      e.target.value = "";
      return;
    }
    importMutation.mutate(file);
    e.target.value = "";
  };

  return (
    <MainCards className="p-3 sm:p-4 md:p-6">
      <div className="mb-3 sm:mb-4">
        <Typography
          variant="h6"
          fontWeight={600}
          className="text-beergam-typography-primary mb-1 text-base sm:text-lg"
        >
          Planilhas de produtos
        </Typography>
        <Typography
          variant="body2"
          className="text-beergam-typography-secondary text-xs sm:text-sm"
        >
          Baixe o modelo, exporte ou importe produtos em massa (SKU e custos).
          Após importar, você pode ativar o controle de estoque nos produtos criados e atualizar os custos nos pedidos.
        </Typography>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <ActionCard
          title="Baixar modelo"
          description="Planilha em branco com as colunas SKU e custos para preenchimento"
          icon="document"
          mainColor="beergam-orange"
          onClick={() => templateMutation.mutate()}
          loading={templateMutation.isPending}
        />
        <ActionCard
          title="Exportar produtos"
          description="Gera planilha com os produtos já cadastrados (SKU e custos)"
          icon="box_arrow_down_solid"
          mainColor="beergam-blue-primary"
          onClick={() => exportMutation.mutate()}
          loading={exportMutation.isPending}
        />
        <ActionCard
          title="Importar planilha"
          description="Envie um .xlsx para criar ou atualizar produtos pelos SKUs"
          icon="arrow_path"
          mainColor="beergam-green"
          onClick={handleImportClick}
          loading={importMutation.isPending}
        />
      </div>
    </MainCards>
  );
}
