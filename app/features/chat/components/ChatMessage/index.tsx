import { Paper } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { MarketplaceType } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import { getMarketplaceImageUrl } from "~/src/constants/cdn-images";
import { ChatUserType, type ChatMessage } from "../../typings";
import MessageAttachments from "./MessageAttachments";

export default function ChatMessage({ message }: { message: ChatMessage }) {
    const isSender = message.user === ChatUserType.SENDER;
    const isSystem = message.user === ChatUserType.SYSTEM;
    const selectedMarketplace = authStore.use.marketplace();

    // Formata a data de forma segura
    const formattedDate = useMemo(() => {
        try {
            const date = dayjs(message.date_created);
            if (!date.isValid()) {
                return "Data inválida";
            }
            return date.format("DD/MM/YYYY HH:mm");
        } catch {
            return "Data inválida";
        }
    }, [message.date_created]);

    // Processa o texto para suportar markdown básico (negrito **texto** e quebras de linha)
    const processedText = useMemo(() => {
        let text = message.text || "";

        // Converte markdown **texto** para <strong>texto</strong>
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Converte quebras de linha para <br />
        text = text.replace(/\n/g, "<br />");

        return text;
    }, [message.text]);

    return (
        <div className={`flex mb-3 ${isSender ? "justify-start" : isSystem ? "justify-center" : "justify-end"}`}>
            <Paper
                className={`
                    relative
                    max-w-[75%]
                    px-4
                    py-3
                    rounded-lg
                    border
                    ${message.status === "sending" ? "opacity-70" : ""}
                    ${message.status === "error" ? "border-red-500!" : ""}
                    ${isSystem
                        ? "bg-beergam-gray! border-beergam-input-border!"
                        : isSender
                            ? "bg-beergam-primary-light! dark:bg-beergam-gray-blueish/70! border-beergam-gray-light! dark:border-beergam-gray-blueish! rounded-tl-none!"
                            : "bg-beergam-primary/80! border-beergam-primary! rounded-br-none!"
                    }
                `}
            >
                {/* Anexos */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2">
                        <MessageAttachments
                            attachments={message.attachments}
                            isSender={isSender}
                            isSystem={isSystem}
                        />
                    </div>
                )}

                {/* Conteúdo da mensagem */}
                {message.text && (
                    <div className="flex items-start gap-2 mb-2">
                        {isSystem && (
                            <div className="w-6 h-6 shrink-0 mt-0.5">
                                <img
                                    src={getMarketplaceImageUrl(selectedMarketplace?.marketplace_type ?? null)}
                                    alt={selectedMarketplace?.marketplace_type ?? MarketplaceType.MELI}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div
                                className={`
                                    text-sm
                                    wrap-break-word
                                    leading-relaxed
                                    ${isSender
                                        ? "text-beergam-typography-primary!"
                                        : isSystem
                                            ? "text-beergam-typography-primary!"
                                            : "text-beergam-white!"
                                    }
                                `}
                                dangerouslySetInnerHTML={{ __html: processedText }}
                            />
                        </div>
                    </div>
                )}

                {/* Timestamp e Status */}
                <div className="flex justify-end items-center gap-2 mt-1">
                    {message.status === "sending" && (
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-beergam-typography-tertiary! border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-beergam-typography-tertiary!">Enviando...</span>
                        </div>
                    )}
                    {message.status === "error" && (
                        <span className="text-xs text-red-500!">Erro ao enviar</span>
                    )}
                    <p
                        className={`
                            text-xs
                            ${isSender
                                ? "text-beergam-typography-tertiary!"
                                : isSystem
                                    ? "text-beergam-typography-tertiary!"
                                    : "text-beergam-white/70!"
                            }
                        `}
                    >
                        {formattedDate}
                    </p>
                </div>
            </Paper>
        </div>
    );
}
