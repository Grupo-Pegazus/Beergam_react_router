import { IconButton } from "@mui/material";
import { useState } from "react";
import ImageViewerModal from "./ImageViewerModal";
import type { ChatAttachment } from "../../typings";

interface MessageAttachmentsProps {
    attachments: ChatAttachment[];
    isSender: boolean;
    isSystem: boolean;
}

/**
 * Componente para exibir anexos de mensagens de chat.
 * 
 * Exibe anexos em um grid similar ao WhatsApp:
 * - 1 anexo: imagem grande
 * - 2 anexos: grid 2x1
 * - 3 anexos: grid 2x2 (primeira imagem ocupa 2 espaços)
 * - 4+ anexos: grid 2x2 com indicador de quantidade restante
 * 
 * Ao clicar em uma imagem, abre um modal com Swiper para visualização em tela cheia,
 * com zoom e navegação entre imagens.
 */
export default function MessageAttachments({
    attachments,
    isSender,
    isSystem,
}: MessageAttachmentsProps) {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!attachments || attachments.length === 0) {
        return null;
    }

    const handleImageClick = (index: number) => {
        setSelectedIndex(index);
        setIsViewerOpen(true);
    };

    const handleCloseViewer = () => {
        setIsViewerOpen(false);
    };

    const handleDownload = (attachment: ChatAttachment) => {
        const link = document.createElement("a");
        link.href = attachment.url;
        link.download = attachment.original_filename || attachment.id;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderAttachment = (attachment: ChatAttachment, index: number, isLarge = false) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(attachment.original_filename || attachment.url);

        return (
            <div
                key={attachment.id}
                className={`
                    relative
                    overflow-hidden
                    rounded-lg
                    cursor-pointer
                    group
                    aspect-square
                    ${isLarge ? "col-span-2 row-span-2" : ""}
                    ${isImage ? "bg-beergam-gray-light" : "bg-beergam-section-background"}
                    border
                    border-beergam-input-border
                    ${isSender || isSystem ? "" : "border-beergam-primary/30"}
                `}
                onClick={() => handleImageClick(index)}
            >
                {isImage ? (
                    <>
                        <img
                            src={attachment.url}
                            alt={attachment.original_filename || `Anexo ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        {/* Overlay com ícone de zoom e download */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            <IconButton
                                size="small"
                                className="bg-white/90! text-beergam-primary!"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(attachment);
                                }}
                                title="Baixar imagem"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                            </IconButton>
                        </div>
                    </>
                ) : (
                    <div className="p-4 flex flex-col items-center justify-center h-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-beergam-typography-secondary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <p className="text-xs text-beergam-typography-secondary mt-2 text-center truncate w-full px-2">
                            {attachment.original_filename || "Arquivo"}
                        </p>
                        <IconButton
                            size="small"
                            className="mt-2 text-beergam-primary!"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(attachment);
                            }}
                            title="Baixar arquivo"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        </IconButton>
                    </div>
                )}
            </div>
        );
    };

    const renderAttachmentsGrid = () => {
        const count = attachments.length;
        const maxWidth = count === 1 ? "300px" : count === 2 ? "250px" : "200px";

        if (count === 1) {
            return (
                <div className="w-full" style={{ maxWidth }}>
                    {renderAttachment(attachments[0], 0, false)}
                </div>
            );
        } else if (count === 2) {
            return (
                <div className="grid grid-cols-2 gap-1 w-full" style={{ maxWidth }}>
                    {attachments.map((attachment, index) => (
                        renderAttachment(attachment, index, false)
                    ))}
                </div>
            );
        } else if (count === 3) {
            return (
                <div className="grid grid-cols-2 gap-1 w-full" style={{ maxWidth }}>
                    <div className="col-span-2 aspect-square">
                        {renderAttachment(attachments[0], 0, false)}
                    </div>
                    {renderAttachment(attachments[1], 1, false)}
                    {renderAttachment(attachments[2], 2, false)}
                </div>
            );
        } else {
            // 4 ou mais anexos
            const visibleAttachments = attachments.slice(0, 4);
            const remainingCount = attachments.length - 4;

            return (
                <div className="grid grid-cols-2 gap-1 w-full" style={{ maxWidth }}>
                    {visibleAttachments.map((attachment, index) => (
                        <div
                            key={attachment.id}
                            className="relative"
                        >
                            {renderAttachment(attachment, index, false)}
                            {index === 3 && remainingCount > 0 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg cursor-pointer z-10 pointer-events-none">
                                    <span className="text-white text-lg font-semibold">
                                        +{remainingCount}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <>
            <div className="mb-2 w-full max-w-full">
                {renderAttachmentsGrid()}
            </div>

            <ImageViewerModal
                isOpen={isViewerOpen}
                attachments={attachments}
                initialIndex={selectedIndex}
                onClose={handleCloseViewer}
                onDownload={handleDownload}
            />
        </>
    );
}
