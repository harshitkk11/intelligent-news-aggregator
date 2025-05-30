import { z } from "zod";

const emailRegex = new RegExp(
  /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/
);

export const LoginSchema = z.object({
  email: z.string().toLowerCase().regex(emailRegex, {
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Please enter your password.",
  }),
});
