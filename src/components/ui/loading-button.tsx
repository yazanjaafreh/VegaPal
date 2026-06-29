import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LoadingButtonProps = ButtonProps & {
  loading?: boolean;
};

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, disabled, children, className, ...props }, ref) => (
    <Button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(className)}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </Button>
  ),
);
LoadingButton.displayName = "LoadingButton";
