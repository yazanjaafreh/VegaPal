import { FormError } from "@/components/ui/form-error";

type AuthFormErrorProps = {
  message: string;
};

/** @deprecated Use FormError — kept for existing auth imports. */
export function AuthFormError({ message }: AuthFormErrorProps) {
  return <FormError message={message} />;
}
