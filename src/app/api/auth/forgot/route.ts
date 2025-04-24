import { supabase } from "@/lib/dbConnect";
import crypto from "crypto";
import { SendResetPassword } from "@/helpers/sendResetPassword";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists in the database.
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("email, isEmailVerified, id, name")
      .eq("email", normalizedEmail)
      .single();

    // If user not exist or email is not verified return an error.
    if (fetchError || !user || !user.isEmailVerified) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save the token and expiry to the user document
    const { error: updateError } = await supabase
      .from("users")
      .update({
        passwordResetToken: hashedToken,
        passwordResetExpires: tokenExpiry,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user:", updateError.message);
      return Response.json(
        {
          success: false,
          message: "Failed to save reset token",
        },
        { status: 500 }
      );
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const emailResponse = await SendResetPassword(
      user.name,
      normalizedEmail,
      resetUrl
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Password reset link sent to email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while sending Password reset link:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
