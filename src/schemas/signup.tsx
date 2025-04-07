import { z } from "zod";

const emailRegex = new RegExp(
  /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/
);

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const SignupSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters long.",
    })
    .max(20, { message: "Name cannot exceed 30 characters." })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Name must not contain special characters.",
    }),
  email: z.string().toLowerCase().regex(emailRegex, {
    message: "Please enter a valid email address",
  }),
  password: z.string().regex(passwordRegex, {
    message:
      "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.",
  }),
});