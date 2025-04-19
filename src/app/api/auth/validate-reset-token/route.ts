import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token } = await request.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Token is valid" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating token:", error);
    return Response.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
