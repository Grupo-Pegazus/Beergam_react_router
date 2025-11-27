import type { Route } from ".react-router/types/app/routes/produtos/cadastro/cadastro_completo/+types/route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beergam | Cadastro Completo" },
    { name: "description", content: "Cadastro Completo" },
  ];
}

export default function CadastroCompleto() {
  return (
    <p>Cadastro Completo</p>
  );
}
