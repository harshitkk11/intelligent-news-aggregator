import Logo from "@/components/Logo";
import { LoginForm } from "../_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Logo width={32} height={32} displayTitle={true} />
      <LoginForm />
    </div>
  );
}
