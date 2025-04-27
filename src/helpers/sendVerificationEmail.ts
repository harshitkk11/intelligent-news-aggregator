import React from "react";
import { createTransporter } from "@/lib/email";
import VerificationEmail from "@/../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import { render } from "@react-email/components";

export async function sendVerificationEmail(
  name: string,
  email: string,
  verificationCode: string
): Promise<ApiResponse> {
  const transporter = await createTransporter();
  try {
    const emailHtml = render(
      React.createElement(VerificationEmail, { name, verificationCode })
    );

    const mailResponse = await new Promise<ApiResponse>((resolve) => {
      transporter.sendMail(
        {
          from: `INA <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to Our Service!",
          html: emailHtml,
        },
        function (error, info) {
          if (error) {
            console.log("ERROR", error);
            resolve({
              success: false,
              message: "Failed to send verification email",
            });
          } else {
            console.log("Email sent: " + info.response);
            resolve({
              success: true,
              message:
                "Verification email sent successfully",
            });
          }
        }
      );
    });

    return mailResponse;
  } catch (error) {
    console.error("Failed to send verification email", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred while sending the verification email.";

    return { success: false, message: errorMessage };
  }
}
