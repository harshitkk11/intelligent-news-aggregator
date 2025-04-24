import { supabase } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("passwordResetToken", hashedToken)
      .gte("passwordResetExpires", new Date().toISOString())
      .single();

    if (!user || fetchError) {
      return Response.json(
        { success: false, message: "User not found or token expired" },
        { status: 404 }
      );
    }

    const hashedPassword = bcrypt.hashSync(newPassword);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("/API/AUTH/RESET_PASSWORD: Supabase update error:", updateError.message);
      return Response.json(
        { success: false, message: "Failed to reset password" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while resetting password:", error);
    return Response.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
