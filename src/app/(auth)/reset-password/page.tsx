"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import NotFound from "@/app/not-found";
import ChangePassword from "../_components/ChangePassword";
import { CircleX, LoaderCircle } from "lucide-react";

const ResetPassword = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post("/api/auth/validate-reset-token", {
          token,
        });

        setIsTokenValid(response.data.success);
      } catch (error) {
        console.error("Error validating token:", error);
        setIsTokenValid(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  if (!token) {
    return <NotFound />;
  }

  return (
    <>
      {isTokenValid === true ? (
        <ChangePassword token={token} />
      ) : isTokenValid === false ? (
        <p className="max-w-[800px] border border-destructive text-center px-6 py-3 rounded-lg flex flex-col sm:flex-row justify-start items-center gap-3">
          <CircleX className="text-destructive" /> It looks like the reset link
          you tried to use is either invalid or has expired.
        </p>
      ) : (
        <LoaderCircle className="animate-spin !w-20 !h-20" />
      )}
    </>
  );
};

export default ResetPassword;
