import { supabase } from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!user || fetchError) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If user exist and email is verified return an error.
    if (user.isEmailVerified) {
      return Response.json(
        {
          success: false,
          message: "Email already in use",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const resendResetDate = user.resendAttemptsReset
      ? new Date(user.resendAttemptsReset)
      : new Date(0);

    let resendAttempts = user.resendAttempts || 0;
    let resendAttemptsReset = resendResetDate;

    // Reset resendAttempts if time has passed
    if (resendResetDate < now) {
      resendAttempts = 0;
      resendAttemptsReset = new Date();
      resendAttemptsReset.setDate(resendAttemptsReset.getDate() + 1); // 24 hours later
    }

    // Check if user exceeded allowed attempts
    if (resendAttempts >= 3) {
      const hoursLeft = Math.ceil(
        (resendAttemptsReset.getTime() - now.getTime()) / (1000 * 60 * 60)
      );
      return Response.json(
        {
          success: false,
          message: `You have reached the resend limit. Try again in ${hoursLeft} hours.`,
        },
        { status: 429 } // Too many requests
      );
    }

    //Generate a verification code and set an expiry time for it and send a verification email.
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 15);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        verificationCode,
        verifyCodeExpiry,
        resendAttempts: resendAttempts + 1,
        resendAttemptsReset,
      })
      .eq("id", userId);

    if (updateError) {
      console.error(
        "/API/RESEND_CODE: Failed to update user:",
        updateError.message
      );
      return Response.json(
        { success: false, message: "Failed to prepare verification email" },
        { status: 500 }
      );
    }

    const emailResponse = await sendVerificationEmail(
      user.name,
      user.email,
      verificationCode
    );

    if (!emailResponse.success) {
      await supabase
        .from("users")
        .update({
          verificationCode: null,
          verifyCodeExpiry: null,
          resendAttempts, // Roll back one attempt
        })
        .eq("id", userId);

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
        message: "Verification code sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while sending verification code:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
