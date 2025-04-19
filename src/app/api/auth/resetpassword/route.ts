import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token, newPassword } = await request.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const hashedPassword = bcrypt.hashSync(newPassword);
    user.password = hashedPassword;

    user.passwordResetToken = "";
    user.passwordResetExpires = new Date();
    await user.save();

    return Response.json(
      { success: true, message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while resetting password:", error);
    return Response.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
