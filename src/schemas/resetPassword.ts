import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, {
        message: "Please enter your password.",
      })
      .regex(passwordRegex, {
        message:
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
      }),
    confirmPassword: z.string().min(1, {
      message: "Please enter your password again.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
