import Logo from "@/components/Logo";
import { SignUpForm } from "../_components/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Logo width={32} height={32} displayTitle={true} />
      <SignUpForm />
    </div>
  );
}
