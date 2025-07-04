import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen relative">
      <div
        className="absolute inset-0 opacity-30 -z-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(156, 163, 175, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px",
        }}
      />
      <Navbar />
      <div className="flex flex-col items-center h-screen mt-48">
        <div className="py-2 px-10 bg-gray-100 rounded-full text-gray-500 mb-3">
        Innovating Through Ethics
        </div>
        <h1 className="text-8xl font-bold text-center">
          Welcome to Sanctity Comments
        </h1>
        <p className="text-center text-gray-500 mt-4 text-4xl">
          A platform for sharing your thoughts and opinions with the world
        </p>
        <div className="flex justify-center mt-8">
          <Link href={"/comment"}>
          <button className="bg-[#469BF7] text-white px-10 py-4 rounded-full hover:bg-[#6ca9ea] hover:cursor-pointer">
            Get Started
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
