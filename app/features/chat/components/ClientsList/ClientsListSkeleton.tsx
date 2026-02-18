import { Skeleton, Stack } from "@mui/material";

export default function ClientsListSkeleton() {
    return (
        <Stack spacing={2}>
            {[1, 2, 3, 4, 5].map((index) => (
                <div
                    key={index}
                    className="rounded-xl p-4 shadow-sm flex flex-col gap-3 bg-beergam-section-background border border-beergam-section-border"
                >
                    <div className="flex items-start gap-3">
                        <Skeleton
                            variant="circular"
                            width={40}
                            height={40}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    height={16}
                                    sx={{ borderRadius: "4px" }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={60}
                                    height={20}
                                    className="rounded-full"
                                />
                            </div>
                            <Skeleton
                                variant="text"
                                width="80%"
                                height={14}
                                sx={{ borderRadius: "4px" }}
                            />
                            <div className="flex items-center gap-4 mt-2">
                                <Skeleton
                                    variant="text"
                                    width={80}
                                    height={12}
                                    sx={{ borderRadius: "4px" }}
                                />
                                <Skeleton
                                    variant="text"
                                    width={100}
                                    height={12}
                                    sx={{ borderRadius: "4px" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </Stack>
    );
}
