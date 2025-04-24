"use client";

import React, { useEffect, useState } from "react";

import { ApiResponse } from "@/types/apiResponse";
import { VerifyCodeSchema } from "@/schemas/verifyCode";

import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

export function VerifyForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();

  const userId = searchParams.get("id");
  const email = searchParams.get("email");

  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(30);

  const form = useForm<z.infer<typeof VerifyCodeSchema>>({
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (!isResendDisabled) return;

    // let interval: NodeJS.Timeout | undefined;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          setTimer(30);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleResendCode = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/auth/resendcode", {
        userId,
      });

      const { success, message } = response.data;

      if (!success) {
        throw new Error(message);
      }

      toast.success(message);
      setIsResendDisabled(true);
      setTimer(30);
    } catch (error) {
      handleError(error, "Failed to resend code");
      setIsResendDisabled(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof VerifyCodeSchema>) => {
    try {
      const response = await axios.post<ApiResponse<{ email: string }>>(
        "/api/auth/verifycode",
        { userId, verificationCode: values.verificationCode },
        {
          withCredentials: true,
        }
      );

      const { success, message, data: user } = response.data;

      if (!success || !user) {
        throw new Error(message);
      }

      await signIn("credentials", {
        email: user.email,
        password: "dummy-password", // Use a dummy since it's required
        redirect: false,
      });

      form.reset();
      window.location.href = `/`;
      toast.success("Registration successful!");
    } catch (error) {
      handleError(error, "Verification failed");
    }
  };

  const handleError = (error: unknown, defaultMessage: string) => {
    const errorMessage =
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : error instanceof Error
          ? error.message
          : defaultMessage;

    console.error(defaultMessage, error);
    toast.error(errorMessage);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Enter Your Verification Code
          </CardTitle>
          <CardDescription
            className={`${!userId || !email ? "text-destructive" : ""}`}
          >
            {!userId || !email ? (
              "Something went wrong."
            ) : (
              <>
                We sent a 6-digit verification code to{" "}
                <span className="font-bold">{email}</span>
              </>
            )}
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
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem className="w-full grid gap-3">
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          disabled={!userId || !email || isSubmitting}
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
                  disabled={!userId || !email || isSubmitting}
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin !w-5 !h-5" />
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </form>
            </Form>

            <div className="flex flex-wrap justify-center items-center gap-1">
              <p className="text-sm text-center text-muted-foreground">
                {isResendDisabled && userId && email
                  ? `Resend Code in ${timer} sec`
                  : "Didn't receive the code?"}
              </p>
              {(!isResendDisabled || !userId || !email) && (
                <Button
                  onClick={handleResendCode}
                  variant="link"
                  size="default"
                  disabled={!userId || !email || isSubmitting}
                  className="text-sm text-blue-600 dark:text-blue-400 p-0 !no-underline h-auto cursor-pointer"
                >
                  Resend
                </Button>
              )}
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
