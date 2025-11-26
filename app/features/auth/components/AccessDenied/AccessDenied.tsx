import Svg from "~/src/assets/svgs/_index";

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      {/* Ícone */}
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-beergam-red/10">
          <Svg.x_circle
            tailWindClasses="h-12 w-12 text-beergam-red"
          />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-center text-2xl font-bold text-beergam-blue-primary">
        Acesso Negado
      </h1>

      {/* Mensagem */}
      <div className="space-y-2 max-w-md text-center">
        <p className="text-base leading-relaxed text-beergam-gray">
          Você não tem permissão para acessar esta página.
        </p>
        <p className="text-sm text-beergam-gray-light">
          Entre em contato com o administrador se você acredita que deveria ter acesso a esta funcionalidade.
        </p>
      </div>
    </div>
  );
}

