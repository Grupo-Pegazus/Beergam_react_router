import { useState, useMemo } from "react";
import { Pagination, Stack, Typography, Button } from "@mui/material";
import { useAttributes } from "../hooks";
import AttributeCard from "./AttributeCard";
import AttributeFormModal from "./AttributeFormModal";
import type { Attribute } from "../typings";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";

interface AttributesListProps {
  filters?: {
    name?: string;
  };
}

export default function AttributesList({ filters = {} }: AttributesListProps) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [expandedAttributeId, setExpandedAttributeId] = useState<string | null>(null);

  const { data, isLoading, error } = useAttributes({
    ...filters,
    page,
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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    nextPage: number
  ) => {
    setPage(nextPage);
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
            <Typography variant="h6" color="error" className="mb-2">
              Erro ao carregar atributos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error instanceof Error ? error.message : "Ocorreu um erro inesperado"}
            </Typography>
          </div>
        </MainCards>
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Header com busca e botão criar */}
        <MainCards>
          <div className="flex flex-col md:flex-row gap-4 p-4 items-end justify-between">
            <div className="flex-1 w-full md:w-auto">
              <FilterSearchInput
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setPage(1);
                }}
                label="Pesquisar atributo"
                placeholder="Pesquisar atributo por nome..."
              />
            </div>
            <Button
              variant="contained"
              onClick={handleCreateClick}
              startIcon={<Svg.plus tailWindClasses="w-5 h-5" />}
              sx={{
                backgroundColor: "var(--color-beergam-blue-primary)",
                "&:hover": {
                  backgroundColor: "var(--color-beergam-orange)",
                },
                whiteSpace: "nowrap",
              }}
            >
              Criar Atributo
            </Button>
          </div>
        </MainCards>

        {/* Lista de atributos */}
        {attributes.length === 0 && !isLoading ? (
          <MainCards>
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Svg.bag tailWindClasses="w-16 h-16 text-gray-300 mb-4" />
              <Typography variant="h6" color="text.secondary" className="mb-2">
                Nenhum atributo encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary">
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

        {/* Paginação */}
        {totalPages > 1 && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Mostrando página {page} de {totalPages} — {totalCount} atributos
              no total
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}

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

