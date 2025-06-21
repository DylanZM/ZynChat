"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError("Error sending password reset email. Please try again.");
      console.error("Password Reset Error:", error.message);
    } else {
      setMessage("Password reset link has been sent to your email.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#4f6ef7]">
            Forgot Password
          </h1>
          <p className="mt-2 text-neutral-300">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form
          onSubmit={handlePasswordReset}
          className="rounded-xl bg-secondary p-8 shadow-lg"
        >
          <div className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 h-12 bg-[#2a3942] border-none text-white focus:ring-2 focus:ring-[#4f6ef7]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className="text-center text-green-400">{message}</p>
            )}
            {error && <p className="text-center text-red-400">{error}</p>}

            <Button
              type="submit"
              className="w-full h-12 bg-[#4f6ef7] hover:bg-[#3d56c5] text-white font-semibold text-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-[#4f6ef7] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 