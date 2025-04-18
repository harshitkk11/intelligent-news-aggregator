import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId } = await request.json();

    const user = await User.findById(userId);

    if (!user) {
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

    // Reset resendAttempts if time has passed
    if (!user.resendAttemptsReset || user.resendAttemptsReset < new Date()) {
      user.resendAttempts = 0;
      const nextReset = new Date();
      nextReset.setDate(nextReset.getDate() + 1); // 24 hours later
      user.resendAttemptsReset = nextReset;
    }

    // Check if user exceeded allowed attempts
    if (user.resendAttempts >= 3) {
      const hoursLeft = Math.ceil(
        (user.resendAttemptsReset.getTime() - new Date().getTime()) /
          (1000 * 60 * 60)
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

    user.verificationCode = verificationCode;
    user.verifyCodeExpiry = verifyCodeExpiry;
    user.resendAttempts += 1;
    await user.save();

    const emailResponse = await sendVerificationEmail(
      user.name,
      user.email,
      verificationCode
    );

    if (!emailResponse.success) {
      user.verifyCodeExpiry = new Date();
      user.verificationCode = " ";
      user.resendAttempts -= 1;
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
