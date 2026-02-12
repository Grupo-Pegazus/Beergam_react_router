import React from "react";
import { useCensorship } from "~/src/components/utils/Censorship/CensorshipContext";
import { TextCensored } from "~/src/components/utils/Censorship/TextCensored";
import Hint from "~/src/components/utils/Hint";

interface DetalhesPedidoProps {
  titulo: string;
  hint: string;
  value: number;
  isCusto?: boolean;
  isHighlight?: boolean; // Para destacar Total Receita e Lucro Final
  style?: React.CSSProperties;
  canBeCensored?: boolean;
}

function DetalhesPedido({
  titulo,
  hint,
  value,
  isCusto,
  isHighlight,
  style,
  canBeCensored = false,
}: DetalhesPedidoProps) {
  // Se for custo, sempre mostra como negativo (vermelho)
  // Se o valor for negativo, mostra como negativo
  // Caso contrário, mostra como positivo (verde)
  const isNegative = value < 0 || (isCusto && value > 0);
  const { isCensored } = useCensorship();
  const censored = canBeCensored && isCensored("vendas_orders_list_details");
  const valorFormatado = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div
      className={`flex items-center justify-between py-4 border-b border-white/10 ${
        isHighlight ? "border-b-2 border-white/20 pt-4 mt-2" : ""
      }`}
      style={style}
    >
      <div className="flex gap-2 max-[488px]:flex-col">
        <p className="text-lg text-beergam-white!">{titulo}</p>
        {hint && (
          <Hint
            message={hint}
            anchorSelect={titulo.toLocaleLowerCase() + "-tooltip"}
          />
        )}
      </div>

      <p
        className={`font-bold text-nowrap mr-4 ${
          isNegative ? "text-beergam-red!" : "text-beergam-green!"
        } ${isHighlight ? "text-xl font-extrabold" : ""}`}
      >
        {censored ? (
          <TextCensored censorshipKey="vendas_orders_list_details">
            {valorFormatado}
          </TextCensored>
        ) : (
          valorFormatado
        )}
      </p>
    </div>
  );
}

export default DetalhesPedido;
