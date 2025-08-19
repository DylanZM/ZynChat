import Link from "next/link";

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
          <Link
            href="/register"
            className="rounded-xl bg-[#4e6bf5] hover:bg-[#3d56c5] text-white font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
          >
            Register Now
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-xl border border-[#4e6bf5] text-[#4e6bf5] hover:bg-[#4e6bf5]/10 font-semibold text-lg h-12 flex items-center justify-center transition-colors px-8"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}