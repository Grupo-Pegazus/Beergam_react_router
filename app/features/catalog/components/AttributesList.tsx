import { Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import Svg from "~/src/assets/svgs/_index";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import PaginationBar from "~/src/components/ui/PaginationBar";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { usePageFromSearchParams } from "~/src/hooks/usePageFromSearchParams";
import { useAttributes } from "../hooks";
import type { Attribute } from "../typings";
import AttributeCard from "./AttributeCard";
import AttributeFormModal from "./AttributeFormModal";

interface AttributesListProps {
  filters?: {
    name?: string;
  };
  /** Quando true, a página é lida/escrita na URL (`?page=N`). @default false */
  syncPageWithUrl?: boolean;
}

export default function AttributesList({ filters = {}, syncPageWithUrl = false }: AttributesListProps) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(
    null
  );
  const [expandedAttributeId, setExpandedAttributeId] = useState<string | null>(
    null
  );

  const { page: pageFromUrl } = usePageFromSearchParams();
  const effectivePage = syncPageWithUrl ? pageFromUrl : page;

  const { data, isLoading, error } = useAttributes({
    ...filters,
    page: effectivePage,
    per_page: perPage,
    name: searchTerm || undefined,
  });

  const attributes = useMemo<Attribute[]>(() => {
    if (!data?.success || !data.data?.attributes) return [];
    return data.data.attributes;
  }, [data]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? attributes.length;

  const [, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!syncPageWithUrl || isLoading || totalPages < 1 || pageFromUrl <= totalPages) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(totalPages));
        return next;
      },
      { replace: true }
    );
  }, [syncPageWithUrl, isLoading, totalPages, pageFromUrl, setSearchParams]);

  const handlePageChange = (nextPage: number) => {
    if (!syncPageWithUrl) setPage(nextPage);
  };

  const handleCreateClick = () => {
    setEditingAttribute(null);
    setShowCreateModal(true);
  };

  const handleEditClick = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingAttribute(null);
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      ErrorFallback={() => (
        <MainCards>
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Typography variant="h6" className="mb-2 text-beergam-red">
              Erro ao carregar atributos
            </Typography>
            <Typography
              variant="body2"
              className="text-beergam-typography-secondary"
            >
              {error instanceof Error
                ? error.message
                : "Ocorreu um erro inesperado"}
            </Typography>
          </div>
        </MainCards>
      )}
    >
      <div className="flex flex-col gap-4" id="attributes-list">
        {/* Header com busca e botão criar */}
        <MainCards>
          <div className="flex flex-col md:flex-row gap-4 p-4 items-end justify-between">
            <div className="flex-1 w-full md:w-auto">
              <FilterSearchInput
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  if (!syncPageWithUrl) setPage(1);
                  else {
                    setSearchParams(
                      (prev) => {
                        const next = new URLSearchParams(prev);
                        next.set("page", "1");
                        return next;
                      },
                      { replace: true }
                    );
                  }
                }}
                label="Pesquisar atributo"
                placeholder="Pesquisar atributo por nome..."
              />
            </div>
            <BeergamButton
              title="Criar Atributo"
              animationStyle="slider"
              onClick={handleCreateClick}
              className="whitespace-nowrap"
            />
          </div>
        </MainCards>

        {/* Lista de atributos */}
        {attributes.length === 0 && !isLoading ? (
          <MainCards>
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Svg.bag tailWindClasses="w-16 h-16 text-beergam-typography-primary mb-4" />
              <Typography
                variant="h6"
                className="mb-2 text-beergam-typography-secondary"
              >
                Nenhum atributo encontrado
              </Typography>
              <Typography
                variant="body2"
                className="text-beergam-typography-secondary"
              >
                {searchTerm
                  ? "Tente pesquisar com outros termos"
                  : "Crie seu primeiro atributo para começar"}
              </Typography>
            </div>
          </MainCards>
        ) : (
          <div className="flex flex-wrap gap-4">
            {attributes.map((attribute) => (
              <div
                key={attribute.id}
                className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-0.75rem)]"
              >
                <AttributeCard
                  attribute={attribute}
                  onEdit={handleEditClick}
                  isExpanded={expandedAttributeId === attribute.id}
                  onToggleExpand={() => {
                    setExpandedAttributeId(
                      expandedAttributeId === attribute.id ? null : attribute.id
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <PaginationBar
          page={Math.min(effectivePage, Math.max(1, totalPages))}
          totalPages={totalPages}
          totalCount={totalCount}
          entityLabel="atributos"
          onChange={handlePageChange}
          scrollOnChange
          scrollTargetId="attributes-list"
          isLoading={isLoading}
          syncWithUrl={syncPageWithUrl}
        />

        {/* Modal de criação/edição */}
        <AttributeFormModal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          attribute={editingAttribute}
        />
      </div>
    </AsyncBoundary>
  );
}
