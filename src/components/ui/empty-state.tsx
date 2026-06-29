import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="p-12 sm:p-16 text-center">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
        aria-hidden
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
