import { toDisplayString } from "@/lib/auth/errors";

type FormErrorProps = {
  message: string;
  id?: string;
};

/** Accessible form error banner — never renders objects or empty placeholders. */
export function FormError({ message, id }: FormErrorProps) {
  const text = toDisplayString(message);
  if (!text) return null;

  return (
    <div
      id={id}
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
    >
      {text}
    </div>
  );
}
