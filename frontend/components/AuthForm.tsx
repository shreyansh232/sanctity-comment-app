"use client";

import { useState } from "react";
import { z } from "zod";
import Link from "next/link";

interface AuthFormProps {
  type: "signin" | "signup";
  action: (data: any) => void;
}

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AuthForm({ type, action }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    setErrors({}); // Clear previous errors

    try {
      if (type === "signup") {
        signUpSchema.parse({ username, password });
      } else {
        signInSchema.parse({ username, password });
      }
      action({ username, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        err.errors.forEach((error) => {
          if (error.path) {
            newErrors[error.path[0]] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center bg-white">
      <div
        className="absolute inset-0 opacity-20 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156, 163, 175, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      
      <div className="w-full max-w-md px-8 py-12 z-10">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            {type === "signin" ? "Welcome Back" : "Welcome"}
          </h1>
        </div>

        <div className="space-y-8">
          <div>
            <label
              htmlFor="username"
              className="block text-lg font-medium text-gray-900 mb-3"
            >
              {type === "signin" ? "Email Address" : "Username"}
            </label>
            <div className="relative">
              <input
                type={type === "signin" ? "email" : "text"}
                id="username"
                className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white focus:outline-none transition-colors ${
                  errors.username 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-gray-200 focus:border-blue-500"
                }`}
                placeholder={type === "signin" ? "johndoe@example.com" : "Enter your username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {type === "signin" && username && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-2">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-900 mb-3"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-6 py-4 text-lg border-2 rounded-2xl bg-white focus:outline-none pr-12 transition-colors ${
                  errors.password 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-gray-200 focus:border-blue-500"
                }`}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-4 px-6 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-2xl transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            {type === "signin" ? "Log In" : "Sign Up"}
          </button>


          <div className="text-center pt-4">
            {type === "signin" ? (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-500 hover:text-blue-600 hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            ) : (
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-blue-500 hover:text-blue-600 hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}