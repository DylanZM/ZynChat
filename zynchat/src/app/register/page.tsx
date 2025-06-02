"use client"

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,    
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm your password." }),
  code: z.string().min(1, { message: "Code is required." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  // Estados para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function onSubmit(values: any) {
    console.log(values);
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary">
      {/* Logo y texto juntos y grandes */}
      <div className="flex items-center justify-center mt-16 mb-14 w-full">
        <span className="flex items-center">
          <span className="text-8xl font-bold text-[#4f6ef7]" >
            ZynChat
          </span>
        </span>
      </div>
      <div className="w-full max-w-md rounded-xl bg-secondary p-8 shadow-lg">
        <p className="mb-6 text-sm text-white">
          Only email registration is supported in your region. One Zynchat account is all you need to access to all Zynchat services.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Nuevo input para nombre de usuario */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]">
                        <User size={18} />
                      </span>
                      <Input
                        type="text"
                        placeholder="Username"
                        {...field}
                        className="bg-[#1a1a1a] text-white pl-12"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]">
                        <Mail size={18} />
                      </span>
                      <Input
                        type="email"
                        placeholder="Email address"
                        {...field}
                        className="bg-[#1a1a1a] text-white pl-12"
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
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]">
                        <Lock size={18} />
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        className="bg-[#1a1a1a] text-white pl-12 pr-12"
                      />
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#f5f5f5] cursor-pointer hover:bg-[#45444a] hover:rounded-lg hover:text-[#ffffff] p-1 transition-colors"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={0}
                        role="button"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]">
                        <Lock size={18} />
                      </span>
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm password"
                        {...field}
                        className="bg-[#1a1a1a] text-white pl-12 pr-12"
                      />
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#f5f5f5] cursor-pointer hover:bg-[#45444a] hover:rounded-lg hover:text-[#ffffff] p-1 transition-colors"
                        onClick={() => setShowConfirm((v) => !v)}
                        tabIndex={0}
                        role="button"
                        aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <div className="flex-1"></div>
            </div>
            <p className="text-xs text-neutral-400">
              By signing up, you consent to Zynchat's{" "}
              <a href="#" className="underline">Terms of Use</a> and{" "}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
            <Button type="submit" className="w-full bg-accent hover:bg-accent text-white font-semibold">
              Sign up
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-accent hover:underline text-sm">Log in</a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <RegisterForm />;
}