import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Experience <span style={{ color: "#4e6bf5" }}>Secure Chatting</span>?
        </h2>
        <p className="text-neutral-300 text-lg mb-8">
          Join millions of users who trust ZynChat for their daily communications.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button variant="hero-primary" className="text-lg h-12 px-8">
              Register Now
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="hero-outline" className="text-lg h-12 px-8">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}