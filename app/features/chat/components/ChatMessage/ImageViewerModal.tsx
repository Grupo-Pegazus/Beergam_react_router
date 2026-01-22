import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/zoom";
import { Navigation, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Modal from "~/src/components/utils/Modal";
import type { ChatAttachment } from "../../typings";

interface ImageViewerModalProps {
    isOpen: boolean;
    attachments: ChatAttachment[];
    initialIndex: number;
    onClose: () => void;
    onDownload?: (attachment: ChatAttachment) => void;
}

/**
 * Modal para visualização de imagens em tela cheia.
 * 
 * Usa o componente Modal existente de forma simples e limpa,
 * sem hacks de CSS ou overrides complexos.
 */
export default function ImageViewerModal({
    isOpen,
    attachments,
    initialIndex,
    onClose,
    onDownload,
}: ImageViewerModalProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            if (swiperRef.current) {
                swiperRef.current.slideTo(initialIndex);
            }
        }
    }, [isOpen, initialIndex]);

    const handleDownload = (attachment: ChatAttachment) => {
        if (onDownload) {
            onDownload(attachment);
            return;
        }

        const link = document.createElement("a");
        link.href = attachment.url;
        link.download = attachment.original_filename || attachment.id;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isImageFile = (filename: string | undefined, url: string): boolean => {
        return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(filename || url);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Visualizar Imagens"
            contentClassName="max-w-[60vw] max-h-[80vh] p-0 overflow-hidden flex flex-col"
            disableClickAway={false}
        >
            <div className="relative w-full flex flex-col bg-beergam-mui-paper" style={{ height: "calc(80vh - 80px)" }}>
                <Swiper
                    modules={[Navigation, Zoom]}
                    navigation
                    zoom={{
                        maxRatio: 3,
                        minRatio: 1,
                    }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        swiper.slideTo(initialIndex);
                    }}
                    onSlideChange={(swiper) => {
                        setCurrentIndex(swiper.activeIndex);
                    }}
                    className="w-full flex-1"
                    style={{ height: "calc(80vh - 140px)", minHeight: 0 }}
                >
                    {attachments.map((attachment, index) => {
                        const isImage = isImageFile(
                            attachment.original_filename,
                            attachment.url
                        );

                        return (
                            <SwiperSlide
                                key={attachment.id}
                                className="flex items-center justify-center"
                                style={{ height: "100%" }}
                            >
                                <div className="swiper-zoom-container w-full h-full flex items-center justify-center bg-beergam-section-background p-4" style={{ minHeight: 0 }}>
                                    {isImage ? (
                                        <img
                                            src={attachment.url}
                                            alt={attachment.original_filename || `Anexo ${index + 1}`}
                                            className="max-w-full max-h-full w-auto h-auto object-contain"
                                            loading="eager"
                                            decoding="async"
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        />
                                    ) : (
                                        <div className="text-beergam-typography-primary text-center p-8">
                                            <p className="text-lg mb-4">
                                                {attachment.original_filename || "Arquivo"}
                                            </p>
                                            <IconButton
                                                onClick={() => handleDownload(attachment)}
                                                className="text-beergam-primary! bg-beergam-gray-light! hover:bg-beergam-gray-200!"
                                                size="large"
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </div>
                                    )}
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <ImageViewerControls
                    currentIndex={currentIndex}
                    totalCount={attachments.length}
                    currentAttachment={attachments[currentIndex]}
                    onDownload={() => handleDownload(attachments[currentIndex])}
                />
            </div>
        </Modal>
    );
}

interface ImageViewerControlsProps {
    currentIndex: number;
    totalCount: number;
    currentAttachment?: ChatAttachment;
    onDownload: () => void;
}

function ImageViewerControls({
    currentIndex,
    totalCount,
    currentAttachment,
    onDownload,
}: ImageViewerControlsProps) {
    if (!currentAttachment) {
        return null;
    }

    return (
        <div className="flex justify-between items-center p-4 border-t border-beergam-section-border bg-beergam-mui-paper">
            <div className="flex items-center gap-2">
                <span className="text-beergam-typography-secondary text-sm">
                    {currentIndex + 1} / {totalCount}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <IconButton
                    onClick={onDownload}
                    className="text-beergam-primary! bg-beergam-gray-light! hover:bg-beergam-gray-200!"
                    size="medium"
                    title="Baixar imagem"
                    aria-label="Baixar imagem"
                >
                    <DownloadIcon />
                </IconButton>
            </div>
        </div>
    );
}

function DownloadIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
    );
}
