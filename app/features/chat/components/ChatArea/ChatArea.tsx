import { Avatar, CircularProgress, Fade, Paper, Skeleton, TextField, Tooltip } from "@mui/material";
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
import { ClientInfo } from "../ClientInfo";
import ChatHeader, { type ChatType } from "./ChatHeader";
import { useClaimDetails } from "../../hooks/useClaimDetails";

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

    // Busca detalhes da reclamação ativa para mostrar se afeta reputação (apenas em reclamacao, não em mediacao)
    const { data: claimResponse, isLoading: isLoadingClaim } = useClaimDetails(
        activeClaimId,
        chatType === "reclamacao" && Boolean(activeClaimId)
    );
    const activeClaim = claimResponse?.success ? claimResponse.data : null;
    const reputationStatus = activeClaim?.affects_reputation?.affects_reputation || "unknown";
    const reputationLabel =
        reputationStatus === "affected" ? "Afetou Reputação" :
        reputationStatus === "not_affected" ? "Não Afetou Reputação" :
        null;

    const isPosVenda = chatType === "pos_venda";
    const isPosVendaComEnvioBloqueado =
        isPosVenda && posPurchaseStatus !== undefined && !posPurchaseStatus.can_message;
    const isPosVendaApenasPorMotivos =
        isPosVenda &&
        posPurchaseStatus !== undefined &&
        !posPurchaseStatus.direct_message.allowed &&
        posPurchaseStatus.can_message;

    type PosPurchaseGuideOption = {
        id: string;
        label: string;
        type: string;
        capAvailable: number;
        charLimit?: number | null;
        templateId?: string | null;
        templatePreview?: string | null;
    };

    const posPurchaseActionOptions: PosPurchaseGuideOption[] = useMemo(() => {
        if (!isPosVendaApenasPorMotivos || !posPurchaseStatus) {
            return [];
        }

        const actionGuide = posPurchaseStatus.action_guide;
        if (!actionGuide || typeof actionGuide !== "object") {
            return [];
        }

        const capsRaw = (actionGuide as any).caps;
        const optionsRoot = (actionGuide as any).options;

        // Mapeia caps por option_id
        const capsById: Record<string, number> = {};
        if (Array.isArray(capsRaw)) {
            for (const item of capsRaw) {
                if (item && typeof item === "object" && typeof item.option_id === "string") {
                    capsById[item.option_id] = Number(item.cap_available ?? 0);
                }
            }
        } else if (capsRaw && typeof capsRaw === "object") {
            const inner = (capsRaw as any).caps_available || capsRaw;
            if (inner && typeof inner === "object") {
                for (const [key, value] of Object.entries(inner)) {
                    if (value && typeof value === "object") {
                        capsById[key] = Number((value as any).cap_available ?? 0);
                    }
                }
            }
        }

        const labelMap: Record<string, string> = {
            REQUEST_VARIANTS: "Solicitar variações do produto",
            REQUEST_BILLING_INFO: "Solicitar dados de faturamento",
            SEND_INVOICE_LINK: "Enviar link para faturamento",
            OTHER: "Mensagem personalizada",
            DELIVERY_PROMISE: "Informar promessa de entrega",
        };

        const optionsContainer = optionsRoot && typeof optionsRoot === "object" ? (optionsRoot as any).options : undefined;
        const rawOptions: any[] = Array.isArray(optionsContainer) ? optionsContainer : [];

        const stripHtml = (html: string): string =>
            html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

        const siteId = "mlb"; // usamos MLB como padrão para textos de template

        const result: PosPurchaseGuideOption[] = [];
        for (const opt of rawOptions) {
            if (!opt || typeof opt !== "object") continue;
            if (opt.enabled === false || opt.actionable === false) continue;

            const id: string = opt.id;
            if (!id) continue;

            const type: string = opt.type || "FREE_TEXT";
            const charLimit: number | null = opt.char_limit ?? null;
            const capAvailable: number = Number(opt.cap_available ?? capsById[id] ?? 0);

            let templateId: string | null = null;
            let templatePreview: string | null = null;
            if (type === "TEMPLATE" && Array.isArray(opt.templates) && opt.templates.length > 0) {
                const tpl = opt.templates[0];
                templateId = tpl.id ?? null;
                const texts = tpl.texts || {};
                const siteTexts = texts[siteId] || texts["mlb"] || texts["mla"] || texts["mlm"] || {};
                const html = siteTexts.html || "";
                if (typeof html === "string" && html.trim()) {
                    templatePreview = stripHtml(html);
                }
            }

            result.push({
                id,
                label: labelMap[id] || id,
                type,
                capAvailable,
                charLimit,
                templateId,
                templatePreview,
            });
        }

        return result;
    }, [isPosVendaApenasPorMotivos, posPurchaseStatus]);

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

    const [selectedGuideOptionId, setSelectedGuideOptionId] = useState<string | null>(null);
    const [selectedGuideOptionTemplateId, setSelectedGuideOptionTemplateId] = useState<string | null>(null);
    const [selectedGuideOptionPreview, setSelectedGuideOptionPreview] = useState<string | null>(null);

    useEffect(() => {
        // Sempre que o contexto mudar, reseta seleção
        setSelectedGuideOptionId(null);
        setSelectedGuideOptionTemplateId(null);
        setSelectedGuideOptionPreview(null);
    }, [contextKey]);

    useEffect(() => {
        if (!isPosVendaApenasPorMotivos || posPurchaseActionOptions.length === 0) {
            return;
        }
        // Define opção padrão: primeira com capAvailable > 0, senão a primeira
        const defaultOption =
            posPurchaseActionOptions.find((opt) => opt.capAvailable > 0) || posPurchaseActionOptions[0];
        setSelectedGuideOptionId(defaultOption.id);
        setSelectedGuideOptionTemplateId(defaultOption.templateId ?? null);
        setSelectedGuideOptionPreview(defaultOption.templatePreview ?? null);

        // Se for template, preenche a mensagem com o texto padrão
        if (defaultOption.type === "TEMPLATE" && defaultOption.templatePreview) {
            setMessage(defaultOption.templatePreview);
        }
    }, [isPosVendaApenasPorMotivos, posPurchaseActionOptions]);

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
            const selectedGuideOption = posPurchaseActionOptions.find(
                (opt) => opt.id === selectedGuideOptionId
            );
            switch (chatType) {
                case "pos_venda":
                    if (!activeOrderId) {
                        throw new Error("Order ID não encontrado");
                    }
                    // Decide o canal de envio conforme status de mensageria:
                    // - Se direct_message.allowed === true, usa fluxo direto (/messages).
                    // - Caso contrário, se can_message === true, envia via motivos (action_guide)
                    //   usando a opção selecionada (TEMPLATE ou FREE_TEXT).
                    if (posPurchaseStatus?.direct_message.allowed) {
                        response = await chatService.sendPosPurchaseMessage(
                            activeOrderId,
                            messageText,
                            attachmentsToSend.length > 0 ? attachmentsToSend : undefined
                        );
                    } else if (posPurchaseStatus?.can_message) {
                        if (!selectedGuideOption || !selectedGuideOptionId) {
                            throw new Error("Nenhuma opção de mensagem está selecionada.");
                        }

                        if (selectedGuideOption.type === "TEMPLATE") {
                            // Para templates, enviamos apenas option_id + template_id,
                            // o texto é definido pelo próprio Mercado Livre.
                            response = await chatService.sendPosPurchaseOptionMessage(
                                activeOrderId,
                                selectedGuideOptionId,
                                selectedGuideOption.templateId ?? selectedGuideOptionTemplateId ?? undefined
                            );
                        } else {
                            // FREE_TEXT: envia texto livre respeitando limites no backend
                            response = await chatService.sendPosPurchaseOptionMessage(
                                activeOrderId,
                                selectedGuideOptionId,
                                undefined,
                                messageText
                            );
                        }
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
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs text-beergam-white/70!">
                                                    Reclamação: {activeClaimId}
                                                </p>
                                                {chatType === "reclamacao" && (
                                                    <>
                                                        {isLoadingClaim ? (
                                                            <Skeleton variant="text" width={120} height={20} />
                                                        ) : reputationStatus !== "unknown" && reputationLabel && (
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full border text-xs w-fit ${
                                                                    reputationStatus === "affected"
                                                                        ? "bg-red-500/30 border-red-500/50 text-red-300"
                                                                        : "bg-green-500/20 border-green-500/40 text-green-300"
                                                                }`}
                                                            >
                                                                {reputationLabel}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
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
                    {isPosVendaComEnvioBloqueado && (
                        <div className="mb-3 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
                            <p className="font-semibold">Conversa desabilitada</p>
                            <p>
                                Você não pode enviar mensagens para esta venda agora. O Mercado Livre
                                permite que você responda somente quando o comprador iniciar ou reabrir a conversa.
                            </p>
                        </div>
                    )}
                    {isPosVendaApenasPorMotivos && (
                        <div className="mb-3 p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-800 space-y-2">
                            <p className="font-semibold">Envio limitado por motivos do Mercado Livre</p>
                            <p>
                                Para esta venda, o Mercado Livre só permite mensagens usando os motivos de pós-venda.
                                Escolha abaixo o tipo de mensagem que deseja enviar.
                            </p>
                            {posPurchaseActionOptions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {posPurchaseActionOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedGuideOptionId(opt.id);
                                                setSelectedGuideOptionTemplateId(opt.templateId ?? null);
                                                setSelectedGuideOptionPreview(opt.templatePreview ?? null);
                                                if (opt.type === "TEMPLATE" && opt.templatePreview) {
                                                    setMessage(opt.templatePreview);
                                                } else if (opt.type !== "TEMPLATE") {
                                                    setMessage("");
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full border text-xs ${
                                                selectedGuideOptionId === opt.id
                                                    ? "bg-amber-600 text-white border-amber-700"
                                                    : "bg-white text-amber-800 border-amber-300 hover:bg-amber-100"
                                            }`}
                                        >
                                            <span className="font-medium">{opt.label}</span>
                                            <span className="ml-1 opacity-80">
                                                ({opt.capAvailable} restante{opt.capAvailable === 1 ? "" : "s"})
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <Fade in={showActions} timeout={300}>
                        <div className="absolute rounded-lg bottom-0 top-0 right-0 left-0 bg-black/50 z-50">
                        </div>
                    </Fade>
                    {allMessages.length === 0 && !isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-beergam-typography-primary!">Nenhuma mensagem encontrada</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <CircularProgress size={32} />
                        </div>
                    )}
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

