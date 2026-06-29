import { toDisplayString } from "@/lib/auth/errors";

type AuthFormErrorProps = {
  message: string;
};

/** Consistent auth form error banner — never renders objects or empty placeholders. */
export function AuthFormError({ message }: AuthFormErrorProps) {
  const text = toDisplayString(message);
  if (!text) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
    >
      {text}
    </div>
  );
}
