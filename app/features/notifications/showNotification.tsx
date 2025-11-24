import type React from "react";
import { type ToastOptions } from "react-hot-toast";
import toast from "~/src/utils/toast";
import Svg from "~/src/assets/svgs/_index";
import OnlineStatus from "./OnlineStatus";
import type { NotificationData } from "./types";
/**
 * Opções padrão para todas as notificações
 */
const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  toasterId: "notifications",
  duration: 4000,
  position: "bottom-right",
  style: {
    maxWidth: "500px",
    width: "auto",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

/**
 * Função padronizada para exibir notificações
 * Aceita apenas tipos específicos de notificações definidos em NotificationData
 *
 * @param data - Dados da notificação (deve ser um dos tipos suportados)
 * @param options - Opções adicionais do toast (opcional)
 * @returns ID do toast criado
 */
export function showNotification(
  data: NotificationData,
  options?: Partial<ToastOptions>
): string {
  let content: React.ReactElement;
  let icon: React.ReactElement | undefined;

  // Processa o tipo de notificação
  switch (data.type) {
    case "online_status":
      if (!data.colab) {
        // Se não houver colab, não mostra a notificação
        return "";
      }
      content = <OnlineStatus colab={data.colab} online={data.online} />;
      break;

    default:
      // TypeScript garante que todos os casos são cobertos
      throw new Error(`Tipo de notificação não suportado: ${typeof data}`);
  }

  // Combina as opções padrão com as opções fornecidas
  const toastOptions: ToastOptions = {
    ...DEFAULT_TOAST_OPTIONS,
    ...options,
    ...(icon && { icon }),
  };

  return toast(
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-beergam-orange font-bold">
          Nova notificação recebida
        </h4>
        <button onClick={() => toast.dismiss(toastOptions.id)}>
          <Svg.x width={20} height={20} />
        </button>
      </div>
      {content}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ff981633] mt-3 overflow-hidden rounded">
        <div
          className="w-full h-full bg-[#FF9816]"
          style={{
            transform: "translateX(0%)",
            animation: `bg-barra-toast-laranja ${toastOptions.duration ? toastOptions.duration - 500 : 4000}ms linear forwards`,
          }}
        />
        <style>
          {`
            @keyframes bg-barra-toast-laranja {
              from { transform: translateX(0%); }
              to { transform: translateX(-100%); }
            }
          `}
        </style>
      </div>
    </div>,
    toastOptions
  );
}
