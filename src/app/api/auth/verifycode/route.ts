import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userId, verificationCode } = await request.json();

    const user = await User.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if the verification code has expired
    if (new Date(user.verifyCodeExpiry) <= new Date()) {
      return Response.json(
        { success: false, message: "Verification code is expired" },
        { status: 400 }
      );
    }

    if (verificationCode !== user.verificationCode) {
      return Response.json(
        { success: false, message: "Verification code is not correct" },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.verifyCodeExpiry = new Date(); // Clear the verification expiry
    user.verificationCode = " "; // Clear verification code after successful verification
    await user.save();

    await createSession(userId);

    return Response.json(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to verify code", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
