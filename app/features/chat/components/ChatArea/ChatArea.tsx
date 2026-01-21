import { Avatar, Fade, Paper, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { Chat, ChatMessage as ChatMessageType } from "../../typings";
import ChatMessage from "../ChatMessage";
import ChatHeader, { type ChatType } from "./ChatHeader";


//     {
//         id: "refund",
//         label: "Devolver o dinheiro do comprador",
//         icon: "currency_dollar",
//         onClick: () => console.log("Refund action"),
//     },
//     {
//         id: "open_dispute",
//         label: "Iniciar uma mediação",
//         icon: "megaphone",
//         onClick: () => console.log("Open dispute action"),
//     },
//     {
//         id: "send_potential_shipping",
//         label: "Enviar uma promessa de envio, uma data",
//         icon: "calendar",
//         onClick: () => console.log("Send potential shipping action"),
//     },
//     {
//         id: "add_shipping_evidence",
//         label: "Publicar uma evidência de que o produto foi enviado",
//         icon: "document",
//         onClick: () => console.log("Add shipping evidence action"),
//     },
//     {
//         id: "send_attachments",
//         label: "Enviar mensagem com anexos",
//         icon: "camera",
//         onClick: () => console.log("Send attachments action"),
//     },
//     {
//         id: "allow_return",
//         label: "Gerar etiqueta de devolução",
//         icon: "arrow_uturn_left",
//         onClick: () => console.log("Allow return action"),
//     },
//     {
//         id: "allow_return_label",
//         label: "Gerar etiqueta de devolução",
//         icon: "arrow_uturn_left",
//         onClick: () => console.log("Allow return label action"),
//     },
//     {
//         id: "allow_partial_refund",
//         label: "Devolução parcial do dinheiro do comprador para reclamações do tipo PDD",
//         icon: "currency_dollar",
//         onClick: () => console.log("Allow partial refund action"),
//     },
//     {
//         id: "send_tracking_number",
//         label: "Enviar o número de rastreamento do envio (tracking number)",
//         icon: "truck",
//         onClick: () => console.log("Send tracking number action"),
//     },
//     {
//         id: "return_review",
//         label: "Realizar a revisão de uma devolução, indicando se o produto chegou conforme esperado ou não",
//         icon: "check_circle",
//         onClick: () => console.log("Return review action"),
//     },
// ];
export interface ChatAreaProps extends Chat {
    chatType?: ChatType;
    onChatTypeChange?: (type: ChatType) => void;
}
export default function ChatArea({
    chatType = "pos_venda",
    onChatTypeChange,
    messages = [],
    actions = [],
    sender
}: ChatAreaProps) {
    const [message, setMessage] = useState<string>("");
    const [showActions, setShowActions] = useState<boolean>(false);
    const actionRef = useRef<HTMLDivElement>(null);
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ChatHeader activeType={chatType} onTypeChange={onChatTypeChange} />
            <Paper className="p-0! text-center mt-2 bg-beergam-section-background! relative flex-1 flex flex-col min-h-0">
                   <div className="sticky top-0 z-1000">
                    <div className="text-beergam-white flex items-center justify-between  rounded-t-lg bg-beergam-menu-background/80! p-2">
                        {sender && (
                            <div className="flex items-start gap-2">
                                <Avatar className="bg-beergam-primary!">{sender.details.nickname.charAt(0) || "C"}</Avatar>
                                <div className="flex flex-col gap-1 items-start">
                                    <h4 className="text-beergam-white!">{sender.details.nickname || "Cliente"}</h4>
                                    {messages.length > 0 && <p className="text-beergam-white!">Criado em {dayjs(messages[0].date_created).format("DD/MM/YYYY HH:mm")}</p>}
                                </div>
                            </div>
                        )}
                        <div ref={actionRef} className="flex items-center gap-2">
                            {/* <BeergamButton icon="user_plus_solid" title="Visualizar cliente" /> */}
                            {actions && actions.length > 0 && actions.map((action) => (
                                <BeergamButton
                                    key={action.id}
                                    icon={action.icon}
                                    title={action.label}
                                    onClick={() => {
                                        action.onClick();
                                        setShowActions(false);
                                    }}
                                    className="justify-start! text-left! w-full! p-2! h-auto! whitespace-normal!"
                                    mainColor="beergam-menu-background"
                                />
                            ))}
                        </div>
                    </div>
                   </div>
                    <div className="p-2 pb-4 flex-1 bg-beergam-section-background! overflow-y-auto min-h-0">
                        <Fade in={showActions} timeout={300}>
                            <div className="absolute rounded-lg bottom-0 top-0 right-0 left-0 bg-black/50 z-50">
                            </div>
                        </Fade>
                        {messages.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-beergam-typography-primary!">Nenhuma mensagem encontrada</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <ChatMessage key={`${message.user}-${message.date_created}-${index}`} message={message as ChatMessageType} />
                        ))}
                    </div>
                    {sender && <div className="p-2 sticky bottom-0 bg-beergam-menu-background/80! rounded-lg z-25 flex items-center gap-2">
                        <TextField
                            fullWidth
                            placeholder="Digite sua mensagem..."
                            value={message}
                            disabled={!sender}
                            sx={{
                                "& .MuiInputBase-root": {
                                    backgroundColor: "var(--color-beergam-mui-paper)",
                                    borderColor: "transparent",
                                    outline: "none"
                                },
                            }}
                            multiline
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <BeergamButton
                            icon={"arrow_uturn_right"}
                            onClick={() => {}}
                        />
                    </div>}
            </Paper>
        </div>
    );
}

// const ChatArea = memo(ChatAreaComponent, (prevProps, nextProps) => {
//     return prevProps.chatType === nextProps.chatType && prevProps.onChatTypeChange === nextProps.onChatTypeChange;
// });

// ChatArea.displayName = "ChatArea";


// export default ChatArea;

