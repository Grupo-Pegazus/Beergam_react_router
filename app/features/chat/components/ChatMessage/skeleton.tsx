import { Paper, Skeleton } from "@mui/material";

interface ChatMessageSkeletonProps {
    index?: number;
}

function ChatMessageSkeletonComponentCard({ index = 0 }: ChatMessageSkeletonProps = {}) {
    const isSystem = index % 5 === 0;
    const isSender = !isSystem && index % 3 === 0;
    
    return (
        <div className={`flex flex-col mt-4 gap-2 ${isSender ? "items-start" : isSystem ? "items-center" : "items-end"}`}>
            <Paper 
                className={`border! w-full max-w-[70%] relative border-beergam-input-border! p-3 ${
                    isSender 
                        ? "rounded-tl-[0px]!" 
                        : isSystem 
                            ? "bg-beergam-gray!" 
                            : "rounded-br-[0px]! bg-beergam-primary/80!"
                }`}
            >
                <div className="max-w-[75%] flex items-center gap-2">
                    {isSystem && (
                        <Skeleton
                            variant="circular"
                            width={32}
                            height={32}
                            sx={{ bgcolor: "rgba(0, 0, 0, 0.08)" }}
                        />
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                        <Skeleton
                            variant="text"
                            width={isSystem ? "100%" : isSender ? "80%" : "70%"}
                            height={16}
                            sx={{ bgcolor: "rgba(0, 0, 0, 0.08)", borderRadius: "4px" }}
                        />
                        <Skeleton
                            variant="text"
                            width={isSystem ? "90%" : isSender ? "60%" : "50%"}
                            height={16}
                            sx={{ bgcolor: "rgba(0, 0, 0, 0.08)", borderRadius: "4px" }}
                        />
                    </div>
                </div>
                <Skeleton
                    variant="text"
                    width={80}
                    height={14}
                    className="absolute bottom-2 right-2"
                    sx={{ bgcolor: "rgba(0, 0, 0, 0.08)", borderRadius: "4px" }}
                />
            </Paper>
        </div>
    );
}

export default function ChatMessageSkeleton({ammount = 10}: {ammount: number}) {
    return (
        <div className="flex flex-col gap-2">
            {[...Array(ammount)].map((_, index) => (
                <ChatMessageSkeletonComponentCard key={`skeleton-${index}`} index={index} />
            ))}
        </div>
    );
}