import { Typography } from "@mui/material";
import { useMemo, useState } from "react";
import Svg from "~/src/assets/svgs/_index";
import { FilterSearchInput } from "~/src/components/filters/components/FilterSearchInput";
import AsyncBoundary from "~/src/components/ui/AsyncBoundary";
import MainCards from "~/src/components/ui/MainCards";
import PaginationBar from "~/src/components/ui/PaginationBar";
import BeergamButton from "~/src/components/utils/BeergamButton";
import { useCategories } from "../hooks";
import type { Category } from "../typings";
import CategoryCard from "./CategoryCard";
import CategoryFormModal from "./CategoryFormModal";

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
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );

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

  const handlePageChange = (nextPage: number) => {
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
              {error instanceof Error
                ? error.message
                : "Ocorreu um erro inesperado"}
            </Typography>
          </div>
        </MainCards>
      )}
    >
      <div className="flex flex-col gap-4" id="categories-list">
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
            <BeergamButton
              title="Criar Categoria"
              animationStyle="slider"
              onClick={handleCreateClick}
              className="whitespace-nowrap"
            />
          </div>
        </MainCards>

        {/* Lista de categorias */}
        {categories.length === 0 && !isLoading ? (
          <MainCards className="bg-beergam-section-background!">
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Svg.box tailWindClasses="w-16 h-16 text-beergam-typography-primary mb-4" />
              <Typography
                variant="h6"
                className="mb-2 text-beergam-typography-primary"
              >
                Nenhuma categoria encontrada
              </Typography>
              <Typography
                variant="body2"
                className="text-beergam-typography-secondary"
              >
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

        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          entityLabel="categorias"
          onChange={handlePageChange}
          scrollOnChange
          scrollTargetId="categories-list"
          isLoading={isLoading}
        />

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
