import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import crypto from "crypto";
import { SendResetPassword } from "@/helpers/sendResetPassword";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists in the database.
    const user = await User.findOne({
      email: normalizedEmail,
    });

    // If user not exist or email is not verified return an error.
    if (!user || !user.isEmailVerified) {
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
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = tokenExpiry;
    await user.save();

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
