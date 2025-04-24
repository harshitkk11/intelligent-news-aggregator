import { supabase } from "@/lib/dbConnect";
// import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const normalizedEmail = email.toLowerCase();

    const { data: user, error } = await supabase
      .from("users")
      .select("id, password, isEmailVerified")
      .eq("email", normalizedEmail)
      .single();

    if (error || !user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isEmailVerified) {
      return Response.json(
        {
          success: false,
          message: "Incorrect email or password",
        },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: "Incorrect email or password",
        },
        { status: 401 }
      );
    }

    // await createSession(user.id);

    return Response.json(
      {
        success: true,
        message: "Valid credentials",
        data: {
          id: user.id,
          email: normalizedEmail,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
