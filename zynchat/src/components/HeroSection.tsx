import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Secure Chat</span>
            <br />
            <span style={{ color: "#4e6bf5" }}>Redefined</span>
          </h1>
          <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of messaging with ZynChat. Military-grade encryption, lightning-fast delivery, and a
            beautiful interface that makes chatting a joy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="rounded-xl bg-[#4e6bf5] hover:bg-[#3d56c5] text-white font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
            >
              Start Chatting Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl border border-[#4e6bf5] text-[#4e6bf5] hover:bg-[#4e6bf5]/10 font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}