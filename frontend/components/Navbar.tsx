"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { MessageCircle } from "lucide-react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <nav className="bg-gray-900 px-6 py-5 rounded-[20px] mx-10 mt-6 z-1000">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-white text-3xl font-semibold flex items-center gap-2">
          <div className="w-10 h-10 bg-[#469BF7] rounded-xl flex items-center justify-center shadow-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
            Sanctity <span className="text-[#469BF7]">Comments</span>
          </div>
        </div>

        {!loggedIn ? (
          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="text-gray-300 hover:text-white transition-colors cursor-pointer font-semibold text-lg"
            >
              Log In
            </Link>
            <div className="text-gray-600 transition-colors cursor-pointer font-light text-4xl">
              |
            </div>
            <Link
              href="/signup"
              className="bg-white text-gray-900 px-8 py-3 rounded-[20px] font-medium hover:bg-[#469BF7] transition-colors cursor-pointer text-lg"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setLoggedIn(false);
            }}
            className="bg-white text-gray-900 px-8 py-3 rounded-[20px] font-medium hover:bg-[#469BF7] transition-colors cursor-pointer text-lg"
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
}
