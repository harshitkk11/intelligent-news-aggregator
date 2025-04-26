import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ApiResponse } from "@/types/apiResponse";

import { ResetPasswordSchema } from "@/schemas//resetPassword";

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
import Logo from "@/components/Logo";
import { LoaderCircle } from "lucide-react";

interface ChangePasswordProps {
  token: string | null;
}

const ChangePassword: FC<ChangePasswordProps> = ({ token }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/auth/resetpassword",
        {
          token,
          newPassword: values.password,
        }
      );

      const { success, message } = response.data;

      if (!success) {
        throw new Error(message);
      }

      form.reset();
      toast.success(
        "Your password has been successfully reset. You can now log in with your new credentials."
      );
      window.setTimeout(() => {
        router.push("/login");
      }, 2000);
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
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Logo width={32} height={32} displayTitle={true} />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create New Password</CardTitle>
            <CardDescription>
              Your new password must be at least 8 characters long and include a
              mix of letters, numbers, and special characters.
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="w-full grid gap-3">
                        <FormLabel>Confirm Password</FormLabel>
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
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
