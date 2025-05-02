"use client";

import React from "react";

import { useAuth } from "@/context/AuthContext";
// import { ApiResponse } from "@/types/apiResponse";
import { ForgotPasswordSchema } from "@/schemas/forgotPassword";

import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { resetPassword } = useAuth();
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      const reset = await resetPassword(values.email);
      // const response = await axios.post<ApiResponse>(
      //   "/api/auth/forgot",
      //   values
      // );

      // const { success, message } = response.data;

      // if (!success) {
      //   throw new Error(message);
      // }

      form.reset();
      toast.success("Password reset link sent to email");
      console.log(reset)
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

      console.error("An unexpected error occurred", error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Your Password?</CardTitle>
          <CardDescription>
            No worries, we&apos;ll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full grid gap-3">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin !w-5 !h-5" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm">
              Back to{" "}
              <Link href="/login" className="underline underline-offset-4">
                log in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
