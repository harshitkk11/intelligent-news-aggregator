import Logo from "@/components/Logo";
import { ForgotPasswordForm } from "../_components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Logo width={32} height={32} displayTitle={true} />
      <ForgotPasswordForm />
    </div>
  );
}
