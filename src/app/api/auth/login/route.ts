import dbConnect from "@/lib/dbConnect";
import { createSession } from "@/lib/session";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
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

    const userId = user._id.toString();

    await createSession(userId);

    return Response.json(
      {
        success: true,
        message: "Login successful",
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
