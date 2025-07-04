"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface authData{
  username: string;
  password: string;
}

export default function SignUp() {
  const router = useRouter();

  const handleSignUp = async (data: authData) => {
    try {
      const response = await fetch("http://localhost:8088/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Sign up successful!");
        router.push("/signin"); // Redirect to sign-in after successful sign-up
      } else {
        toast.error(result.message || "Sign up failed!");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("An error occurred during sign up.");
    }
  };

  return <AuthForm type="signup" action={handleSignUp} />;
}
