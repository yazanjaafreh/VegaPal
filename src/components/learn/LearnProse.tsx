import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function LearnProse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "learn-prose space-y-8 text-base text-muted-foreground leading-relaxed",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2",
        "[&_p]:mb-4",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4",
        "[&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
        className,
      )}
    >
      {children}
    </div>
  );
}
