import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import Credentials from "next-auth/providers/credentials";

import { supabase } from "@/lib/dbConnect";
// import { createSession } from "@/lib/session";

import bcrypt from "bcryptjs";
import crypto from "crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    // Credentials({
    //   name: "Credentials",
    //   credentials: {
    //     email: {
    //       label: "Email",
    //       type: "email",
    //       placeholder: "you@example.com",
    //     },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     await dbConnect();

    //     if (!credentials?.email || !credentials?.password) {
    //       throw new Error("Missing email or password");
    //     }

    //     const normalizedEmail = credentials.email;

    //     const user = await User.findOne({ email: normalizedEmail }).select(
    //       "+password"
    //     );

    //     if (!user) {
    //       throw new Error("User not found");
    //     }

    //     if (!user.isEmailVerified) {
    //       throw new Error("Email not verified");
    //     }

    //     const isPasswordValid = await bcrypt.compare(
    //       credentials.password,
    //       user.password
    //     );
    //     if (!isPasswordValid) {
    //       throw new Error("Incorrect email or password");
    //     }

    //     await createSession(user._id.toString());

    //     return {
    //       id: user._id.toString(),
    //       name: user.name,
    //       email: user.email,
    //       image: user.avatar,
    //     };
    //   },
    // }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 = no rows found (expected sometimes)
          console.error("Error fetching user:", fetchError.message);
          return false;
        }

        if (!existingUser) {
          const randomPassword = crypto.randomBytes(16).toString("hex");
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          const { error: insertError } = await supabase
          .from("users")
          .insert([
            {
              name: user.name,
              email: user.email,
              avatar: user.image as string,
              password: hashedPassword,
              verificationCode: " ", // Empty string
              verifyCodeExpiry: new Date(),
              isEmailVerified: true,
            },
          ]);
          if (insertError) {
            console.error("Error inserting new user:", insertError.message);
            return false;
          }

          // await createSession(newUser._id.toString());
          // return true;
        }

        // await createSession(existingUser._id.toString());
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
