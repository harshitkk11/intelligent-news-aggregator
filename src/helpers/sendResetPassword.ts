import React from "react";
import { transporter } from "@/lib/email";
import ResetPasswordEmail from "@/../emails/resetPassword";
import { ApiResponse } from "@/types/apiResponse";
import { render } from "@react-email/components";

export const SendResetPassword = async (
  name: string,
  email: string,
  resetUrl: string
): Promise<ApiResponse> => {
  try {
    const emailHtml = render(
      React.createElement(ResetPasswordEmail, { name, resetUrl })
    );

    await transporter.sendMail(
      {
        from: `INA ${process.env.EMAIL_USER}`,
        to: email,
        subject: "Account Password Reset",
        html: emailHtml,
      },
      function (error, info) {
        if (error) {
          console.log(error);
          return {
            success: false,
            message: "Failed to send password reset link",
          };
        } else {
          console.log("Email sent: " + info.response);
          return {
            success: true,
            message: "Reset password link email sent successfully",
          };
        }
      }
    );
    return {
      success: true,
      message: "Reset password link sent successfully on your email address",
    };
  } catch (error) {
    console.error("Failed to send reset password link on email:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred while sending the reset password link.";

    return { success: false, message: errorMessage };
  }
};
