import Svg from "~/src/assets/svgs/_index";

interface MaintenanceDeniedProps {
  message?: string;
}

export default function MaintenanceDenied({ message }: MaintenanceDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      {/* Ícone */}
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-beergam-orange/10">
          <Svg.cog_8_tooth
            tailWindClasses="h-12 w-12 text-beergam-orange"
          />
        </div>
      </div>

      {/* Título */}
      <h1 className="text-center text-2xl font-bold text-beergam-blue-primary">
        Manutenção em Andamento
      </h1>

      {/* Mensagem */}
      <div className="space-y-2 max-w-md text-center">
        <p className="text-base leading-relaxed text-beergam-gray">
          {message ||
            "Estamos realizando algumas atualizações nesta tela. Volte mais tarde."}
        </p>
        <p className="text-sm text-beergam-gray-light">
          Você pode continuar navegando pelo sistema normalmente.
        </p>
      </div>
    </div>
  );
}
