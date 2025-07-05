"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface authData{
  username: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://sanctity-comment-appbackend-production.up.railway.app/api'
  const handleSignIn = async (data: authData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Sign in successful!");
        // Store token in localStorage or a secure cookie
        localStorage.setItem("token", result.token);
        router.push("/"); // Redirect to home page after successful sign-in
      } else {
        toast.error(result.message || "Sign in failed!");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error("An error occurred during sign in.");
    }
  };

  return <AuthForm type="signin" action={handleSignIn} />;
}
