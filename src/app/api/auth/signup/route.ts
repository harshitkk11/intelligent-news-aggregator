import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, password } = await request.json();

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists in the database.
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

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
      await existingUser.deleteOne();
    }

    //Generate a verification code and set an expiry time for it and send a verification email.
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setMinutes(verifyCodeExpiry.getMinutes() + 15);

    const hashedPassword = bcrypt.hashSync(password);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      verificationCode,
      verifyCodeExpiry,
      isEmailVerified: false,
    });

    const emailResponse = await sendVerificationEmail(
      name,
      normalizedEmail,
      verificationCode
    );

    if (!emailResponse.success) {
      // If sending the verification email fails, delete the user data from the database.
      await newUser.deleteOne();
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
        data: { userId: newUser._id, email: normalizedEmail },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}