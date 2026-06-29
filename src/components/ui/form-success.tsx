import { CheckCircle2 } from "lucide-react";
import { toDisplayString } from "@/lib/auth/errors";

type FormSuccessProps = {
  message: string;
};

export function FormSuccess({ message }: FormSuccessProps) {
  const text = toDisplayString(message);
  if (!text) return null;

  return (
    <div
      role="status"
      className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm text-foreground"
    >
      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
      <span>{text}</span>
    </div>
  );
}
