import { useState, useMemo } from "react";
import { Pagination, Stack, Typography, Button } from "@mui/material";
import { useCategories } from "../hooks";
import CategoryCard from "./CategoryCard";
import CategoryFormModal from "./CategoryFormModal";
import type { Category } from "../typings";
import MainCards from "~/src/components/ui/MainCards";
import Svg from "~/src/assets/svgs/_index";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";

interface CategoriesListProps {
  filters?: {
    name?: string;
    description?: string;
  };
}

export default function CategoriesList({ filters = {} }: CategoriesListProps) {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const { data, isLoading, error } = useCategories({
    ...filters,
    page,
    per_page: perPage,
    name: searchTerm || undefined,
  });

  const categories = useMemo<Category[]>(() => {
    if (!data?.success || !data.data?.categories) return [];
    return data.data.categories;
  }, [data]);

  const pagination = data?.success ? data.data?.pagination : null;
  const totalPages = pagination?.total_pages ?? 1;
  const totalCount = pagination?.total_count ?? categories.length;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    nextPage: number
  ) => {
    setPage(nextPage);
  };

  const handleCreateClick = () => {
    setEditingCategory(null);
    setShowCreateModal(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCategory(null);
  };

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error as unknown}
      ErrorFallback={() => (
        <MainCards>
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Typography variant="h6" color="error" className="mb-2">
              Erro ao carregar categorias
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
                label="Pesquisar categoria"
                placeholder="Pesquisar categoria por nome..."
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
              Criar Categoria
            </Button>
          </div>
        </MainCards>

        {/* Lista de categorias */}
        {categories.length === 0 && !isLoading ? (
          <MainCards>
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Svg.box tailWindClasses="w-16 h-16 text-gray-300 mb-4" />
              <Typography variant="h6" color="text.secondary" className="mb-2">
                Nenhuma categoria encontrada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchTerm
                  ? "Tente pesquisar com outros termos"
                  : "Crie sua primeira categoria para começar"}
              </Typography>
            </div>
          </MainCards>
        ) : (
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-0.75rem)]"
              >
                <CategoryCard
                  category={category}
                  onEdit={handleEditClick}
                  isExpanded={expandedCategoryId === category.id}
                  onToggleExpand={() => {
                    setExpandedCategoryId(
                      expandedCategoryId === category.id ? null : category.id
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
              Mostrando página {page} de {totalPages} — {totalCount} categorias
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
        <CategoryFormModal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          category={editingCategory}
        />
      </div>
    </AsyncBoundary>
  );
}

