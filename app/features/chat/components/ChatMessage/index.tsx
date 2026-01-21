import { Paper } from "@mui/material";
import dayjs from "dayjs";
import { MarketplaceType } from "~/features/marketplace/typings";
import authStore from "~/features/store-zustand";
import { getMarketplaceImageUrl } from "~/src/constants/cdn-images";
import { ChatUserType, type ChatMessage } from "../../typings";
export default function ChatMessage({ message }: { message: ChatMessage }) {
    const isSender = message.user === ChatUserType.SENDER;
    const isSystem = message.user === ChatUserType.SYSTEM;
    const selectedMarketplace = authStore.use.marketplace();
    return (
        <div className={`flex flex-col mt-4 gap-2 ${isSender ? "items-start" : isSystem ? "items-center" : "items-end"}`}>
            <Paper className={`border! w-full max-w-[70%] relative border-beergam-input-border! ${isSender ? "rounded-tl-[0px]!" : isSystem ? "bg-beergam-gray!" : "rounded-br-[0px]! bg-beergam-primary/80!"}`}>
            <div className="max-w-[75%] flex items-center gap-2">
                {isSystem && <div className="size-8!"><img  src={getMarketplaceImageUrl(selectedMarketplace?.marketplace_type ?? null)} alt={selectedMarketplace?.marketplace_type ?? MarketplaceType.MELI} className="size-full! object-contain" /></div>}
                <p className={`${isSender ? "text-beergam-typography-tertiary!" : "text-beergam-white!"} text-left text-sm `}>{message.text}</p>
            </div>
            
                <p className={`text-sm absolute bottom-2 right-2 ${isSender ? "text-beergam-typography-tertiary!" : "text-beergam-white!"}`}>{dayjs(message.date_created).format("DD/MM/YYYY HH:mm")}</p>
            </Paper>
        </div>
    );
}