import { Loader2 } from "lucide-react";

type PageLoadingProps = {
  message?: string;
};

export function PageLoading({ message }: PageLoadingProps) {
  return (
    <div
      className="min-h-screen bg-muted/30 flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
        {message ? <span>{message}</span> : null}
      </div>
    </div>
  );
}
