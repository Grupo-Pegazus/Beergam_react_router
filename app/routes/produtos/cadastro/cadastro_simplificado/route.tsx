import type { Route } from ".react-router/types/app/routes/produtos/cadastro/cadastro_simplificado/+types/route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Cadastro Simplificado" },
    { name: "description", content: "Cadastro Simplificado" },
  ];
}

export default function CadastroSimplificado() {
  return (
    <p>Cadastro Simplificado</p>
  );
}
