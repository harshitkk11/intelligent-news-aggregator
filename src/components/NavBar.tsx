"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";

const NavBar = () => {
  const session = useSession();

  console.log(session);

  const handleLogout = async () => {
    try {
      const response = await axios.get<ApiResponse>(`/api/auth/logout`, {
        withCredentials: true,
      });

      const { success, message } = response.data;

      if (!success) {
        throw new Error(message);
      }

      window.location.reload();
    } catch (error) {
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
    <header className="w-full h-[65px] px-5 flex justify-end items-center bg-secondary">
      {/* {session.status !== "loading" &&
        (session.status === "unauthenticated" ? ( */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="cursor-pointer">
              <Button>Login</Button>
            </Link>
            <Link href="/signup" className="cursor-pointer">
              <Button>Sign up</Button>
            </Link>
          </div>
        {/* ) : ( */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex justify-start !px-2 !py-1.5 gap-2"
          >
            <LogOut className="!w-5 !h-5" />
            Log out
          </Button>
        {/* ))} */}
    </header>
  );
};

export default NavBar;
