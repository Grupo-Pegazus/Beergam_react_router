import { memo } from "react";
import { Paper } from "@mui/material";
import ChatHeader, { type ChatType } from "./ChatHeader";

export interface ChatAreaProps {
    chatType?: ChatType;
    onChatTypeChange?: (type: ChatType) => void;
}

function ChatAreaComponent({
    chatType = "pos_venda",
    onChatTypeChange,
}: ChatAreaProps) {
    return (
        <div className="flex flex-col h-full bg-beergam-section-background border border-beergam-section-border rounded-xl overflow-hidden">
            <ChatHeader activeType={chatType} onTypeChange={onChatTypeChange} />
            <div className="flex-1 overflow-y-auto p-4">
                <Paper className="p-8 text-center bg-beergam-section-background! border border-beergam-section-border">
                    <p className="text-beergam-typography-secondary">
                        Área de chat será implementada em breve
                    </p>
                    <p className="text-sm text-beergam-typography-secondary mt-2">
                        Tipo de chat selecionado: {chatType}
                    </p>
                </Paper>
            </div>
        </div>
    );
}

const ChatArea = memo(ChatAreaComponent, (prevProps, nextProps) => {
    return prevProps.chatType === nextProps.chatType && prevProps.onChatTypeChange === nextProps.onChatTypeChange;
});

ChatArea.displayName = "ChatArea";

export { ChatArea };
export default ChatArea;
