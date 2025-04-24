import { supabase } from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists in the database.
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", normalizedEmail)
      .single();

    // If it does and email is verified return an error.
    if (existingUser) {
      const isCodeExpired =
        new Date(existingUser.verifyCodeExpiry) <= new Date();

      if (existingUser.isEmailVerified || !isCodeExpired) {
        return Response.json(
          {
            success: false,
            message: "Email already in use",
          },
          { status: 400 }
        );
      }

      // Delete unverified user if the code is expired.
      await supabase.from("users").delete().eq("id", existingUser.id);
    } else if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means "no rows found" — not an error
      console.error(
        "API/AUTH/SIGNUP: Error checking existing user:",
        fetchError.message
      );
      return Response.json(
        {
          success: false,
          message: "Failed to check existing user",
        },
        { status: 500 }
      );
    }

    //Generate a verification code and set an expiry time for it and send a verification email.
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 15);

    const hashedPassword = bcrypt.hashSync(password);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          verificationCode,
          verifyCodeExpiry,
          isEmailVerified: false,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(
        "API/AUTH/SIGNUP: Error inserting new user:",
        insertError.message
      );
      return Response.json(
        {
          success: false,
          message: "Failed to create user",
        },
        { status: 500 }
      );
    }

    const emailResponse = await sendVerificationEmail(
      name,
      normalizedEmail,
      verificationCode
    );

    if (!emailResponse.success) {
      // If sending the verification email fails, delete the user data from the database.
      await supabase.from("users").delete().eq("id", newUser.id);
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
        message: "Verification email sent successfully",
        data: { userId: newUser.id, email: normalizedEmail },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API/AUTH/SIGNUP: Error during user registration:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
