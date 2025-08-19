import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span>Secure Chat</span>
            <br />
            <span style={{ color: "#4e6bf5" }}>Redefined</span>
          </h1>
          <p className="text-xl  mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of messaging with ZynChat. Military-grade encryption, lightning-fast delivery, and a
            beautiful interface that makes chatting a joy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button
                variant="hero-primary"
                className="text-xl h-12 px-10"
              >
                Start Chatting Free
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="hero-outline"
                className="text-xl h-12 px-10"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}