"use client"

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,    
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  async function onSubmit(values: any) {
    // Buscar el usuario por username en la tabla users
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, username, name")
      .eq("username", values.username)
      .single();

    if (userError || !user) {
      alert("Usuario no encontrado.");
      return;
    }

    // Login con el email encontrado
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: values.password,
    });

    if (loginError) {
      alert("Credenciales incorrectas o usuario no registrado.");
      return;
    }

    setUser({
      id: loginData.user.id,
      email: loginData.user.email || "",
      name: loginData.user.user_metadata?.name || user.username,
    });

    router.push("/chat");
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary">
      <div className="flex items-center justify-center mt-16 mb-14 w-full">
        <span className="flex items-center">
          <span className="text-8xl font-bold text-[#4f6ef7]">
            ZynChat
          </span>
        </span>
      </div>
      <div className="w-full max-w-md rounded-xl bg-secondary p-8 shadow-lg">
        <p className="mb-6 text-sm text-neutral-300">
          Login with your username and password.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a1aa]">
                        <User size={18} />
                      </span>
                      <Input
                        type="text"
                        placeholder="Username"
                        {...field}
                        className="bg-[#1a1a1a] border border-[#525252] text-white pl-12 h-12 rounded-xl text-base focus:border-[#4e6bf5] focus:ring-2 focus:ring-[#4e6bf5]/60"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a1aa]">
                        <Lock size={18} />
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        className="bg-[#1a1a1a] border border-[#525252] text-white pl-12 pr-12 h-12 rounded-xl text-base focus:border-[#4e6bf5] focus:ring-2 focus:ring-[#4e6bf5]/60"
                      />
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a1a1aa] cursor-pointer hover:text-white p-1 transition-colors"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={0}
                        role="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs text-neutral-400">
              By signing up or logging in, you consent to Zynchat's{" "}
              <a href="#" className="underline">Terms of Use</a> and{" "}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full rounded-xl font-semibold text-lg h-12 bg-[#4e6bf5] hover:bg-[#3d56c5] text-white"
            >
              Log in
            </Button>
          </form>
        </Form>
        <div className="flex justify-between items-center mt-6">
          <Link
            href="/forgot-password"
            className="text-[#4e6bf5] hover:underline text-sm"
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            className="text-[#4e6bf5] hover:underline text-sm"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <LoginForm />;
}