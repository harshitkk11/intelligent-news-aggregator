"use client";

import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/apiResponse";
import { SignupSchema } from "@/schemas/signup";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import GoogleAuth from "./GoogleAuth";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    try {
      const response = await axios.post<
        ApiResponse<{ userId: string; email: string }>
      >("/api/auth/signup", values, {
        withCredentials: true,
      });

      const { success, message, data } = response.data;

      if (!success) {
        throw new Error(message);
      }

      if (!data) {
        throw new Error("An unexpected error occurred during signup.");
      }

      form.reset();
      router.push(`/verify?id=${data.userId}&email=${data.email}`);
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred during signup.";

      console.error("An unexpected error occurred during signup", error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Create a new account with Google</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <GoogleAuth
                title="Sign up with Google"
                isDisabled={isSubmitting}
              />
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full grid gap-3">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Full Name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full grid gap-3">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
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
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin !w-5 !h-5" />
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </form>
            </Form>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
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
