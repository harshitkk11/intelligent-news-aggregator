import { supabase } from "@/lib/dbConnect";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { userId, verificationCode } = await request.json();

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      console.error("Error fetching user:", fetchError?.message);
      return Response.json(
        {
          success: false,
          message: fetchError ? fetchError.message : "User not found",
        },
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

    const { error: updateError } = await supabase
    .from("users")
    .update({
      isEmailVerified: true,
      verifyCodeExpiry: new Date().toISOString(),
      verificationCode: " ", // Clearing the code
    })
    .eq("id", userId);

    if (updateError) {
      console.error("Error updating user:", updateError.message);
      return Response.json(
        { success: false, message: "Failed to verify email" },
        { status: 500 }
      );
    }

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
