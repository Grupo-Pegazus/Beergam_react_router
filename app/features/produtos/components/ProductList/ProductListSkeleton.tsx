import MainCards from "~/src/components/ui/MainCards";
import { Stack } from "@mui/material";

export default function ProductListSkeleton() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3, 4, 5].map((index) => (
        <MainCards key={index}>
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-12 md:col-span-5 flex items-center gap-3">
              <div className="h-16 w-16 rounded-lg bg-beergam-mui-paper animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-beergam-mui-paper rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-beergam-mui-paper rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 space-y-2">
              <div className="h-4 bg-beergam-mui-paper rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-beergam-mui-paper rounded w-1/3 animate-pulse" />
            </div>
            <div className="col-span-12 md:col-span-3 flex justify-end">
              <div className="h-8 w-8 bg-beergam-mui-paper rounded animate-pulse" />
            </div>
          </div>
        </MainCards>
      ))}
    </Stack>
  );
}

