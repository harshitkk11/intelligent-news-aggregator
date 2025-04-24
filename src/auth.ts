import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { supabase } from "@/lib/dbConnect";
// import { createSession } from "@/lib/session";

import bcrypt from "bcryptjs";
import crypto from "crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const normalizedEmail = credentials.email;

        const { data: user, error } = await supabase
          .from("users")
          .select("id, email, isEmailVerified")
          .eq("email", normalizedEmail)
          .single();

        if (error || !user || !user.isEmailVerified) {
          throw new Error("Invalid or unverified user");
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
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

          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                name: user.name,
                email: user.email,
                avatar: user.image as string,
                password: hashedPassword,
                verificationCode: null,
                verifyCodeExpiry: null,
                isEmailVerified: true,
              },
            ])
            .select("id")
            .single();

          if (!newUser || insertError) {
            console.error(
              "Error inserting new user:",
              insertError?.message || "Unknown error"
            );
            return false;
          }

          // await createSession(newUser.id);
          return true;
        }

        // await createSession(existingUser.id.toString());
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
