import nodemailer from "nodemailer";
import VerificationEmail from "@/../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import { render } from "@react-email/components";
import React from "react";

export async function sendVerificationEmail(
  name: string,
  email: string,
  verificationCode: string
): Promise<ApiResponse> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  try {
    const emailHtml = render(
      React.createElement(VerificationEmail, { name, verificationCode })
    );

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Our Service!",
      html: emailHtml,
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Failed to send verification email", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred while sending the verification email.";

    return { success: false, message: errorMessage };
  }
}
