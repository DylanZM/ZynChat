"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <nav className="border-b border-secondary bg-primary/80 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/img/ZynChat-Logo.png" alt="ZynChat Logo" width={125} height={125} />
          </Link>
          <div className="flex gap-4">
            <Link href="/register">
              <Button
                variant="hero-primary"
                className="text-base h-10 px-6"
              >
                Register Now
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="hero-outline"
                className="text-base h-10 px-6"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}