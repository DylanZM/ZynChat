import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary text-white p-4">
      <div className="flex flex-col items-center justify-center text-center">
       
        <h1 className="text-7xl font-bold text-[#4f6ef7] mb-3">
          ZynChat
        </h1>
        <p className="text-lg text-neutral-300 mb-8 max-w-md">
          Welcome to ZynChat, your secure and modern online chat.
          Log in or register to start chatting with your friends.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Link
          href="/login"
          className="w-full rounded-xl bg-[#4e6bf5] hover:bg-[#3d56c5] text-white font-semibold text-lg h-12 flex items-center justify-center transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="w-full rounded-xl border border-[#4e6bf5] text-[#4e6bf5] hover:bg-[#4e6bf5]/10 font-semibold text-lg h-12 flex items-center justify-center transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
