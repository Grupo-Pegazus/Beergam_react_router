import MainCards from "~/src/components/ui/MainCards";
import Typography from "@mui/material/Typography";
import ClickableCard from "~/src/components/ui/ClickableCard";

export default function CatalogQuickAccess() {
  return (
    <MainCards className="p-3 sm:p-4 md:p-6">
      <div className="mb-3 sm:mb-4">
        <Typography variant="h6" fontWeight={600} className="text-slate-900 mb-1 text-base sm:text-lg">
          Acesso Rápido
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-xs sm:text-sm">
          Gerencie categorias e atributos dos seus produtos
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <ClickableCard
          title="Categorias"
          description="Organize seus produtos em categorias para facilitar a busca e navegação"
          icon="list"
          mainColor="beergam-orange"
          to="/interno/produtos/categorias"
        />
        <ClickableCard
          title="Atributos"
          description="Defina características e variações dos produtos como cor, tamanho, modelo, etc."
          icon="document"
          mainColor="beergam-blue-primary"
          to="/interno/produtos/atributos"
        />
      </div>
    </MainCards>
  );
}

