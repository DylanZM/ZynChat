import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary">
      <div className="flex flex-col items-center justify-center mt-16 mb-10 w-full">
        <span className="text-8xl font-bold text-[#4f6ef7] mb-4">
          ZynChat
        </span>
        <p className="text-lg text-neutral-300 mb-2 text-center max-w-xl">
          Bienvenido a ZynChat, tu chat online seguro y moderno.<br />
          Inicia sesión o regístrate para comenzar a chatear con tus amigos.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          href="/login"
          className="w-full sm:w-1/2 rounded-xl bg-[#4e6bf5] hover:bg-[#3d56c5] text-white font-semibold text-lg h-12 flex items-center justify-center transition-colors"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="w-full sm:w-1/2 rounded-xl border border-[#4e6bf5] text-[#4e6bf5] hover:bg-[#1a1a1a] font-semibold text-lg h-12 flex items-center justify-center transition-colors"
        >
          Registrarse
        </Link>
      </div>
      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center text-neutral-400 text-sm">
        <a
          className="hover:underline hover:underline-offset-4"
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Next.js
        </a>
        <a
          className="hover:underline hover:underline-offset-4"
          href="https://vercel.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deploy on Vercel
        </a>
      </footer>
    </div>
  );
}