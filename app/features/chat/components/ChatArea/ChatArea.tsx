import { Avatar, Fade, Paper, Skeleton, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import BeergamButton from "~/src/components/utils/BeergamButton";
import type { Chat, ChatMessage as ChatMessageType } from "../../typings";
import ChatMessage from "../ChatMessage";
import ChatMessageSkeleton from "../ChatMessage/skeleton";
import ChatHeader, { type ChatType } from "./ChatHeader";

/**
 * Props do componente ChatArea
 * 
 * Estende a interface Chat que contém:
 * - sender: Informações detalhadas do remetente (ChatUserDetails | null)
 * - messages: Array de mensagens do chat (ChatMessage[])
 * - actions: Array opcional de ações disponíveis no chat (ChatAction[])
 * 
 * Props adicionais específicas do ChatArea:
 */
export interface ChatAreaProps extends Chat {
    /**
     * Tipo de chat ativo. Define qual aba está selecionada no header.
     * Valores possíveis: "pos_venda" | "reclamacao" | "mediacao"
     * @default "pos_venda"
     */
    chatType?: ChatType;
    
    /**
     * Callback chamado quando o tipo de chat é alterado pelo usuário.
     * Recebe o novo tipo de chat selecionado.
     */
    onChatTypeChange?: (type: ChatType) => void;
    
    /**
     * Indica se o componente está em estado de carregamento.
     * Quando true, exibe skeletons das mensagens ao invés das mensagens reais.
     * @default false
     */
    isLoading?: boolean;
}

/**
 * Componente principal de área de chat.
 * 
 * Exibe uma interface completa de chat incluindo:
 * - Header com abas para diferentes tipos de chat (Pós-venda, Reclamação, Mediação)
 * - Informações do remetente (avatar, nickname, data de criação)
 * - Lista de mensagens com scroll automático
 * - Campo de input para envio de novas mensagens
 * - Botões de ações contextuais (quando disponíveis)
 * 
 * Estados internos:
 * - message: Texto da mensagem sendo digitada
 * - showActions: Controla a exibição de overlay de ações
 * 
 * Comportamento:
 * - Quando isLoading é true, exibe skeletons aleatórios (2-10) das mensagens
 * - Quando não há mensagens, exibe mensagem "Nenhuma mensagem encontrada"
 * - Campo de input só é habilitado quando há um sender definido
 * - Ações são renderizadas como botões no header quando disponíveis
 * 
 * @example
 * ```tsx
 * <ChatArea
 *   chatType="pos_venda"
 *   onChatTypeChange={(type) => console.log(type)}
 *   messages={chatMessages}
 *   sender={chatSender}
 *   actions={chatActions}
 *   isLoading={false}
 * />
 * ```
 */
export default function ChatArea({
    chatType = "pos_venda",
    onChatTypeChange,
    messages = [],
    actions = [],
    sender,
    isLoading = false
}: ChatAreaProps) {
    const [message, setMessage] = useState<string>("");
    const [showActions, setShowActions] = useState<boolean>(false);
    const actionRef = useRef<HTMLDivElement>(null);
    const randomSkeletonAmmount = useMemo(() => Math.floor(Math.random() * 10) + 2, [messages.length]);
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ChatHeader activeType={chatType} onTypeChange={onChatTypeChange} />
            <Paper className="p-0! text-center mt-2 bg-beergam-section-background! relative flex-1 flex flex-col min-h-0">
                   <div className="sticky top-0 z-100">
                    <div className="text-beergam-white flex items-center justify-between  rounded-t-lg bg-beergam-menu-background/80! p-2">
                        {sender && (
                            <div className="flex items-start gap-2">
                                <Avatar className="bg-beergam-primary!">{sender.details.nickname.charAt(0) || "C"}</Avatar>
                                <div className="flex flex-col gap-1 items-start">
                                    <h4 className="text-beergam-white!">{sender.details.nickname || "Cliente"}</h4>
                                    {messages.length > 0 && !isLoading && <p className="text-beergam-white!">Criado em {dayjs(messages[0].date_created).format("DD/MM/YYYY HH:mm")}</p>}
                                    {isLoading && <Skeleton variant="text" width={100} height={16} />}
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
                                    mainColor="beergam-primary"
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
                        {isLoading && <><ChatMessageSkeleton ammount={randomSkeletonAmmount} /></>}
                        {!isLoading && <>{messages.map((message, index) => (
                            <ChatMessage key={`${message.user}-${message.date_created}-${index}`} message={message as ChatMessageType} />
                        ))}</>}
                    </div>
                    {sender && !isLoading && <div className="p-2 sticky bottom-0 bg-beergam-menu-background/80! rounded-lg z-25 flex items-center gap-2">
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

