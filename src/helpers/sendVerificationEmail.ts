import React from "react";
import { transporter } from "@/lib/email";
import VerificationEmail from "@/../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import { render } from "@react-email/components";

export async function sendVerificationEmail(
  name: string,
  email: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    const emailHtml = render(
      React.createElement(VerificationEmail, { name, verificationCode })
    );

    await transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome to Our Service!",
        html: emailHtml,
      },
      function (error, info) {
        if (error) {
          console.log(error);
          return { success: false, message: "Failed to send verification email" };
        } else {
          console.log("Email sent: " + info.response);
          return {
            success: true,
            message: "Verification email sent successfully",
          };
        }
      }
    );
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
