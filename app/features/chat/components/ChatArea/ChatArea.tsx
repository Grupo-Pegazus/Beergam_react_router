import { Avatar, Fade, Paper, Skeleton, TextField, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "~/src/utils/toast";
import BeergamButton from "~/src/components/utils/BeergamButton";
import Modal from "~/src/components/utils/Modal";
import Upload from "~/src/components/utils/upload";
import { chatService, createClaimAttachmentUploadService, createPosPurchaseAttachmentUploadService } from "../../service";
import type { Chat, ChatMessage as ChatMessageType, Client, PosPurchaseMessagingStatus } from "../../typings";
import { ChatUserType } from "../../typings";
import ChatMessage from "../ChatMessage";
import ChatMessageSkeleton from "../ChatMessage/skeleton";
import { ClientInfo } from "../ClientInfo";
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

    /**
     * Indica se o cliente selecionado tem reclamações.
     * Se false, as abas de reclamação e mediação serão desabilitadas.
     * @default false
     */
    hasClaims?: boolean;

    /**
     * Cliente completo para exibir informações detalhadas no modal.
     * Opcional, usado para abrir o modal de detalhes do cliente.
     */
    client?: Client;

    /**
     * Order ID atualmente ativo para exibir no chat.
     * Usado para mostrar qual pedido está sendo visualizado e permitir troca.
     */
    activeOrderId?: string | null;

    /**
     * Claim ID atualmente ativo para exibir no chat.
     * Usado para mostrar qual reclamação está sendo visualizada e permitir troca.
     */
    activeClaimId?: string | null;

    /**
     * Callback chamado quando o usuário quer trocar o pedido atual.
     */
    onOrderChange?: () => void;

    /**
     * Callback chamado quando o usuário quer trocar a reclamação atual.
     */
    onClaimChange?: () => void;

    /**
     * Status de mensageria pós-venda do pedido ativo.
     * Usado para validar se o usuário pode enviar mensagens e qual canal utilizar.
     */
    posPurchaseStatus?: PosPurchaseMessagingStatus;
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
    isLoading = false,
    hasClaims = false,
    client,
    activeOrderId,
    activeClaimId,
    onOrderChange,
    onClaimChange,
    posPurchaseStatus,
}: ChatAreaProps) {
    const [message, setMessage] = useState<string>("");
    const [showActions, setShowActions] = useState<boolean>(false);
    const [showClientModal, setShowClientModal] = useState<boolean>(false);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<string[]>([]);
    const [sendingMessages, setSendingMessages] = useState<Map<string, ChatMessageType>>(new Map());
    const [isSending, setIsSending] = useState<boolean>(false);
    const actionRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const randomSkeletonAmmount = useMemo(() => Math.floor(Math.random() * 10) + 2, [messages.length]);

    // Cria uma chave única baseada no contexto atual (cliente, tipo de chat e pedido/reclamação)
    const contextKey = useMemo(() => {
        const clientId = client?.client_id || "no-client";
        const orderOrClaimId = chatType === "pos_venda" ? activeOrderId : activeClaimId;
        return `${clientId}-${chatType}-${orderOrClaimId || "none"}`;
    }, [client?.client_id, chatType, activeOrderId, activeClaimId]);

    // Limpa anexos e mensagem quando o contexto muda (cliente, tipo de chat ou pedido/reclamação)
    // Também fecha o modal de upload para garantir que o componente seja resetado
    useEffect(() => {
        setAttachments([]);
        setMessage("");
        setShowUploadModal(false);
    }, [contextKey]);

    // Combina mensagens recebidas com mensagens sendo enviadas
    const allMessages = useMemo(() => {
        const combined: ChatMessageType[] = [...messages];
        sendingMessages.forEach((msg) => {
            combined.push(msg);
        });
        // Ordena por data de criação
        return combined.sort((a, b) => {
            const dateA = new Date(a.date_created).getTime();
            const dateB = new Date(b.date_created).getTime();
            return dateA - dateB;
        });
    }, [messages, sendingMessages]);

    /**
     * Envia uma mensagem para o chat atual.
     * Cria uma mensagem temporária com status "sending", envia para o backend,
     * e atualiza o status quando a resposta voltar.
     */
    const handleSendMessage = async () => {
        if (!message.trim() || !sender || isSending) {
            return;
        }

        const messageText = message.trim();
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        const tempMessage: ChatMessageType = {
            text: messageText,
            user: ChatUserType.SENDER,
            date_created: new Date().toISOString(),
            status: "sending",
            tempId,
            attachments: attachments.length > 0 ? attachments.map((filename) => ({
                id: filename,
                original_filename: filename,
                url: "",
            })) : undefined,
        };

        // Adiciona mensagem temporária
        setSendingMessages((prev) => {
            const next = new Map(prev);
            next.set(tempId, tempMessage);
            return next;
        });

        setIsSending(true);
        setMessage("");
        const attachmentsToSend = [...attachments];
        // Limpa anexos imediatamente para feedback visual
        setAttachments([]);

        try {
            let response;
            switch (chatType) {
                case "pos_venda":
                    if (!activeOrderId) {
                        throw new Error("Order ID não encontrado");
                    }
                    // Decide o canal de envio conforme status de mensageria:
                    // - Se direct_message.allowed === true, usa fluxo direto (/messages).
                    // - Caso contrário, se can_message === true, tenta enviar via motivos (action_guide) usando OTHER.
                    if (posPurchaseStatus?.direct_message.allowed) {
                        response = await chatService.sendPosPurchaseMessage(
                            activeOrderId,
                            messageText,
                            attachmentsToSend.length > 0 ? attachmentsToSend : undefined
                        );
                    } else if (posPurchaseStatus?.can_message) {
                        // Fluxo de primeira mensagem via motivos.
                        response = await chatService.sendPosPurchaseOptionMessage(
                            activeOrderId,
                            "OTHER",
                            undefined,
                            messageText
                        );
                    } else {
                        throw new Error("Você não pode enviar mensagens para este pedido no momento.");
                    }
                    break;
                case "reclamacao":
                    if (!activeClaimId) {
                        throw new Error("Claim ID não encontrado");
                    }
                    response = await chatService.sendClaimMessage(
                        activeClaimId,
                        messageText,
                        attachmentsToSend.length > 0 ? attachmentsToSend : undefined
                    );
                    break;
                case "mediacao":
                    if (!activeClaimId) {
                        throw new Error("Claim ID não encontrado");
                    }
                    response = await chatService.sendMediationMessage(
                        activeClaimId,
                        messageText,
                        attachmentsToSend.length > 0 ? attachmentsToSend : undefined
                    );
                    break;
                default:
                    throw new Error("Tipo de chat não suportado");
            }

            if (response.success) {
                // Remove mensagem temporária
                setSendingMessages((prev) => {
                    const next = new Map(prev);
                    next.delete(tempId);
                    return next;
                });

                // Invalida queries para buscar mensagens atualizadas
                switch (chatType) {
                    case "pos_venda":
                        queryClient.invalidateQueries({ queryKey: ["chat", "pos-purchase", activeOrderId] });
                        break;
                    case "reclamacao":
                        queryClient.invalidateQueries({ queryKey: ["chat", "claim", activeClaimId] });
                        break;
                    case "mediacao":
                        queryClient.invalidateQueries({ queryKey: ["chat", "mediation", activeClaimId] });
                        break;
                }

                toast.success("Mensagem enviada com sucesso");
                // Anexos já foram limpos e a mensagem foi enviada com sucesso, não precisa restaurar
            } else {
                throw new Error(response.message || "Erro ao enviar mensagem");
            }
        } catch (error) {
            // Atualiza mensagem temporária com status de erro
            setSendingMessages((prev) => {
                const next = new Map(prev);
                const errorMessage = next.get(tempId);
                if (errorMessage) {
                    next.set(tempId, {
                        ...errorMessage,
                        status: "error",
                    });
                }
                return next;
            });

            // Restaura anexos em caso de erro para permitir nova tentativa
            setAttachments(attachmentsToSend);

            const errorMessage = error instanceof Error ? error.message : "Erro ao enviar mensagem";
            toast.error(errorMessage);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ChatHeader
                activeType={chatType}
                onTypeChange={onChatTypeChange}
                hasClaims={hasClaims}
            />
            <Paper className="p-0! mt-2 bg-beergam-section-background! relative flex-1 flex flex-col min-h-0">
                <div className="sticky top-0 z-100">
                    <div className="text-beergam-white flex items-center justify-between  rounded-t-lg bg-beergam-menu-background/80! p-2">
                        {sender && (
                            <>
                                <div className="flex items-start gap-2 flex-1 min-w-0">
                                    <Avatar className="bg-beergam-primary!">{sender.details.nickname.charAt(0) || "C"}</Avatar>
                                    <div className="flex flex-col gap-1 items-start min-w-0 flex-1">
                                        <h4 className="text-beergam-white!">{sender.details.nickname || "Cliente"}</h4>
                                        {messages.length > 0 && !isLoading && <p className="text-beergam-white!">Criado em {dayjs(messages[0].date_created).format("DD/MM/YYYY HH:mm")}</p>}
                                        {isLoading && <Skeleton variant="text" width={100} height={16} />}
                                        {/* Mostra qual pedido/reclamação está ativo */}
                                        {chatType === "pos_venda" && activeOrderId && (
                                            <p className="text-xs text-beergam-white/70!">
                                                Pedido: {activeOrderId}
                                            </p>
                                        )}
                                        {(chatType === "reclamacao" || chatType === "mediacao") && activeClaimId && (
                                            <p className="text-xs text-beergam-white/70!">
                                                Reclamação: {activeClaimId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div ref={actionRef} className="flex items-center gap-2 shrink-0">
                                    {/* Botão para trocar pedido/reclamação */}
                                    {chatType === "pos_venda" && client && client.orders.length > 1 && onOrderChange && (
                                        <BeergamButton
                                            icon="arrow_path"
                                            title="Trocar pedido"
                                            onClick={onOrderChange}
                                            className="p-2!"
                                        />
                                    )}
                                    {(chatType === "reclamacao" || chatType === "mediacao") && client && client.claims.length > 1 && onClaimChange && (
                                        <BeergamButton
                                            icon="arrow_path"
                                            title="Trocar reclamação"
                                            onClick={onClaimChange}
                                            className="p-2!"
                                        />
                                    )}
                                    <BeergamButton icon="user_plus_solid" title="Detalhes" onClick={() => setShowClientModal(true)} />
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
                            </>
                        )}
                    </div>
                </div>
                <div className="p-4 pb-4 flex-1 bg-beergam-section-background! overflow-y-auto min-h-0">
                    <Fade in={showActions} timeout={300}>
                        <div className="absolute rounded-lg bottom-0 top-0 right-0 left-0 bg-black/50 z-50">
                        </div>
                    </Fade>
                    {allMessages.length === 0 && !isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-beergam-typography-primary!">Nenhuma mensagem encontrada</p>
                        </div>
                    )}
                    {isLoading && <><ChatMessageSkeleton ammount={randomSkeletonAmmount} /></>}
                    {!isLoading && allMessages.length > 0 && (
                        <>
                            {allMessages.map((message, index) => {
                                const key = message.tempId || `${message.user}-${message.date_created}-${index}`;
                                return <ChatMessage key={key} message={message as ChatMessageType} />;
                            })}
                        </>
                    )}
                </div>
                {sender && !isLoading && <div className="p-2 sticky bottom-0 bg-beergam-menu-background/80! rounded-lg z-25 flex flex-col gap-2">
                    {/* Anexos selecionados */}
                    {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {attachments.map((filename, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 bg-beergam-section-background! px-2 py-1 rounded text-sm"
                                >
                                    <span className="text-beergam-typography-primary!">{filename}</span>
                                    <BeergamButton
                                        icon="x"
                                        onClick={() => {
                                            setAttachments((prev) => prev.filter((_, i) => i !== index));
                                        }}
                                        className="p-1! min-w-0!"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Tooltip
                            title={
                                chatType === "pos_venda" &&
                                posPurchaseStatus &&
                                !posPurchaseStatus.can_message
                                    ? "Você não pode enviar mensagens para este pedido. Verifique o status da conversa no Mercado Livre."
                                    : ""
                            }
                        >
                            <TextField
                                fullWidth
                                placeholder="Digite sua mensagem..."
                                value={message}
                                disabled={
                                    !sender ||
                                    isSending ||
                                    (chatType === "pos_venda" &&
                                        posPurchaseStatus !== undefined &&
                                        !posPurchaseStatus.can_message)
                                }
                                sx={{
                                    "& .MuiInputBase-root": {
                                        backgroundColor: "var(--color-beergam-mui-paper)",
                                        borderColor: "transparent",
                                        outline: "none"
                                    },
                                }}
                                multiline
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                        </Tooltip>
                        {/* Botão de anexo para pós-venda, reclamação e mediação */}
                        {(
                            ((chatType === "reclamacao" || chatType === "mediacao") && activeClaimId) ||
                            (chatType === "pos_venda" && activeOrderId)
                        ) && (
                            <BeergamButton
                                icon="clip"
                                onClick={() => setShowUploadModal(true)}
                                disabled={isSending}
                            />
                        )}
                        <BeergamButton
                            icon={"arrow_uturn_right"}
                            onClick={handleSendMessage}
                            disabled={
                                !message.trim() ||
                                isSending ||
                                !sender ||
                                (chatType === "pos_venda" &&
                                    posPurchaseStatus !== undefined &&
                                    !posPurchaseStatus.can_message)
                            }
                        />
                    </div>
                </div>}
            </Paper>

            {/* Modal de detalhes do cliente */}
            <Modal
                isOpen={showClientModal}
                onClose={() => setShowClientModal(false)}
                title="Detalhes do Cliente"
                className="z-1000"
                contentClassName="!max-w-2xl !max-h-[90vh] overflow-y-auto"
            >
                <ClientInfo client={client} />
            </Modal>

            {/* Modal de upload de anexos */}
            {/* Usa contextKey como key para forçar remount quando o contexto muda, resetando o estado interno do Upload */}
            {(chatType === "reclamacao" || chatType === "mediacao") && activeClaimId && (
                <Upload
                    key={contextKey}
                    title="Upload de Anexos"
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    typeImport="external"
                    service={createClaimAttachmentUploadService(activeClaimId)}
                    marketplace="meli"
                    maxFiles={5}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    emptyStateLabel="Arraste e solte ou clique para selecionar arquivos (JPG, PNG ou PDF)"
                    draggingLabel="Solte para iniciar o upload"
                    onUploadSuccess={(ids) => {
                        setAttachments((prev) => [...prev, ...ids]);
                        setShowUploadModal(false);
                        toast.success(`${ids.length} arquivo(s) anexado(s) com sucesso`);
                    }}
                    onError={(error) => {
                        toast.error(error.message || "Erro ao fazer upload do anexo");
                    }}
                />
            )}
            {chatType === "pos_venda" && activeOrderId && (
                <Upload
                    key={contextKey}
                    title="Upload de Anexos"
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    typeImport="external"
                    service={createPosPurchaseAttachmentUploadService(activeOrderId)}
                    marketplace="meli"
                    maxFiles={5}
                    accept="image/jpeg,image/jpg,image/png,application/pdf,text/plain"
                    emptyStateLabel="Arraste e solte ou clique para selecionar arquivos (JPG, PNG, PDF ou TXT)"
                    draggingLabel="Solte para iniciar o upload"
                    onUploadSuccess={(ids) => {
                        setAttachments((prev) => [...prev, ...ids]);
                        setShowUploadModal(false);
                        toast.success(`${ids.length} arquivo(s) anexado(s) com sucesso`);
                    }}
                    onError={(error) => {
                        toast.error(error.message || "Erro ao fazer upload do anexo");
                    }}
                />
            )}
        </div>
    );
}

// const ChatArea = memo(ChatAreaComponent, (prevProps, nextProps) => {
//     return prevProps.chatType === nextProps.chatType && prevProps.onChatTypeChange === nextProps.onChatTypeChange;
// });

// ChatArea.displayName = "ChatArea";


// export default ChatArea;

