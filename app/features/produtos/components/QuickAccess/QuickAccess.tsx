import Typography from "@mui/material/Typography";
import ClickableCard from "~/src/components/ui/ClickableCard";
import MainCards from "~/src/components/ui/MainCards";

export default function QuickAccess() {
  return (
    <MainCards className="p-3 sm:p-4 md:p-6">
      <div className="mb-3 sm:mb-4">
        <Typography
          variant="h6"
          fontWeight={600}
          className="text-beergam-typography-primary mb-1 text-base sm:text-lg"
        >
          Gestão de Catálogo
        </Typography>
        <Typography
          variant="body2"
          className="text-beergam-typography-secondary text-xs sm:text-sm"
        >
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
        <ClickableCard
          title="Cadastro Simplificado"
          description="Cadastre seus produtos de forma simplificada"
          icon="pencil"
          mainColor="beergam-orange"
          to="/interno/produtos/cadastro/cadastro_simplificado"
        />
        <ClickableCard
          title="Cadastro Completo"
          description="Cadastre seus produtos de forma completa"
          icon="pencil"
          mainColor="beergam-blue-primary"
          to="/interno/produtos/cadastro/cadastro_completo"
        />
      </div>
    </MainCards>
  );
}
