import { Skeleton } from "@/components/ui/skeleton";

type ListSkeletonProps = {
  rows?: number;
};

export function ListSkeleton({ rows = 5 }: ListSkeletonProps) {
  return (
    <div className="divide-y divide-border" aria-hidden>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 max-w-[12rem]" />
            <Skeleton className="h-3 w-1/3 max-w-[8rem]" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function StatCardsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
