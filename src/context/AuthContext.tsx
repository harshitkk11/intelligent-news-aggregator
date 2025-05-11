"use client";

import type { User } from "firebase/auth";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getIdToken,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";
import api from "@/lib/axiosInstance";

const AUTH_COOKIE_NAME = "auth-token";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        if (!user.emailVerified) {
          // User is logged in but not verified
          await firebaseSignOut(auth); // Sign out unverified users
          Cookies.remove(AUTH_COOKIE_NAME);
          return;
        }
        // Get the ID token and store it in a cookie
        try {
          const token = await getIdToken(user);
          // Store token in a cookie accessible by the server (httpOnly recommended for production)
          Cookies.set(AUTH_COOKIE_NAME, JSON.stringify({ token }), {
            expires: 7, // Cookie expiration in days
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "lax", // Adjust SameSite policy as needed
          });
          // Optionally redirect based on query param after login
          const searchParams = new URLSearchParams(window.location.search);
          const redirectUrl = searchParams.get("redirectedFrom");

          if (redirectUrl && window.location.pathname !== redirectUrl) {
            router.push(redirectUrl);
          } else if (!redirectUrl && window.location.pathname === "/login") {
            // If no redirect specified and on login page, go home
            router.push("/");
          }
        } catch (error) {
          console.error("Error getting ID token:", error);
          // Handle token retrieval error (e.g., sign out user, show error)
          await signOut(); // Sign out if token fails
        }
      } else {
        // Remove the cookie on sign out
        Cookies.remove(AUTH_COOKIE_NAME);
        // Optional: Redirect to login if trying to access protected route while signed out
        // This might be better handled by middleware, but can be a fallback.
        // if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        //   router.push('/login');
        // }
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // router dependency might not be strictly needed here anymore

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);

      const { data: createData } = await api.post<ApiResponse>(
        "/api/user/create-user",
        { userId: user.uid }
      );

      if (createData.success) {
        const { data: updateData } = await api.patch<
          ApiResponse<{
            data: { isNew: boolean };
          }>
        >("/api/user/update-status", { userId: user.uid });

        if (updateData.success && updateData.message === "Status updated.") {
          router.push("/preferences");
        }
      } else {
        router.push("/");
      }

      // Redirect is now handled by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, { displayName: name });
      await api.post<ApiResponse>("/api/user/create-user", {
        userId: user.uid,
      });

      await sendEmailVerification(user);
      await firebaseSignOut(auth);

      toast.success(
        "Thank you for registering. Please check your inbox for a verification email to confirm your email address."
      );
      // Redirect is now handled by onAuthStateChanged
    } catch (error: unknown) {
      console.error("Error during sign up:", error);
      if (
        error instanceof Error &&
        (error as { code?: string }).code === "auth/email-already-in-use"
      ) {
        throw new Error("Email already in use.");
      } else {
        throw new Error("An unexpected error occurred during signup.");
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error("Please verify your email before logging in.");
      }

      if (user.emailVerified) {
        const { data } = await api.patch<
          ApiResponse<{
            data: { isNew: boolean };
          }>
        >("/api/user/update-status", { userId: user.uid });

        if (data.success && data.message === "Status updated.") {
          router.push("/preferences");
        }
      }
      // Redirect is now handled by onAuthStateChanged
    } catch (error: unknown) {
      console.error("Error signing in with email:", error);
      if (
        error instanceof Error &&
        (error as { code?: string }).code === "auth/invalid-credential"
      ) {
        throw new Error("Invalid user credential");
      } else {
        if (error instanceof Error) {
          throw new Error(error.message || "Login failed.");
        } else {
          throw new Error("Login failed."); // Fallback for non-Error types
        }
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Cookie removal handled by onAuthStateChanged
      router.push("/"); // Explicit redirect after manual sign out
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error; // Re-throw error to be caught in the component
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
