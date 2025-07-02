"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../utils/auth";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <nav className="bg-gray-900 px-6 py-5 rounded-[20px] mx-10 mt-6 z-1000">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-white text-3xl font-semibold flex items-center gap-1">
            <span className="text-[#469BF7]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </span>
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
