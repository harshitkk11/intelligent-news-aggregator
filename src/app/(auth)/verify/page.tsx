import Logo from "@/components/Logo";
import { VerifyForm } from "../_components/verification-form";

export default function VerifyPage() {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Logo width={32} height={32} displayTitle={true} />
      <VerifyForm />
    </div>
  );
}
