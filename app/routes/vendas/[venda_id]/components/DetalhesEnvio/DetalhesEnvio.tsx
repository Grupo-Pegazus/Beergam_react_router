import React from "react";

interface DetalhesEnvioProps {
  children: React.ReactNode;
  title: string;
}

function DetalhesEnvio({ children, title }: DetalhesEnvioProps) {
  const textMap: Record<string, string> = {
    Endereço: "Endereço de Entrega",
    Produto: "Detalhes do Produto",
    Entrega: "Detalhes da Entrega",
    "Informações Técnicas:": "Informações Técnicas:",
  };

  return (
    <div className="bg-beergam-section-background! rounded-[15px] p-5 mb-5 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="mb-4">
        <p className="text-lg text-beergam-typography-primary! m-0 font-semibold">
          {textMap[title]}
        </p>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default DetalhesEnvio;
