import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
    return (
        <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-36 sm:h-60 overflow-hidden bg-muted">
                <Skeleton className="w-full h-full" />
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
                <Skeleton className="h-4 sm:h-5 w-3/4" />
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 sm:h-10 flex-1 rounded-md" />
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-md" />
                </div>
            </div>
        </div>
    )
}

export function DealSkeleton() {
    return (
        <div className="pl-2 sm:pl-6 basis-[85%] sm:basis-[48%] lg:basis-[24%]">
            <div className="relative w-full max-w-[320px] mx-auto aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
                <Skeleton className="w-full h-full" />
            </div>
        </div>
    )
}

export function CategorySkeleton() {
    return (
        <div className="mt-4 sm:mt-8 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 sm:h-10 w-24 sm:w-32 rounded-full shrink-0" />
            ))}
        </div>
    )
}
