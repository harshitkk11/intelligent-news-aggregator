import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { User } from "@/models/user";
import dbConnect from "@/lib/dbConnect";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      await dbConnect();
      try {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const randomPassword = crypto.randomBytes(16).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          const newUser = await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image as string,
            password: hashedPassword,
            verificationCode: " ",
            verifyCodeExpiry: new Date(),
            isEmailVerified: true,
          });

          await createSession(newUser._id.toString());
          return true;
        }

        await createSession(existingUser._id.toString());
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
  pages: {
    error: "/error",
  },
});