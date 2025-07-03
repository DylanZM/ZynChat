"use client"

import React, { useState, useEffect } from "react";
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
import { supabase, checkSupabaseConnection } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import Image from "next/image";

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
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const router = useRouter();
  const { setUser } = useUser();



  async function onSubmit(values: any) {
    try {
      console.log("Intentando login con username:", values.username);
      
      // Buscar el usuario por username en la tabla users
      const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, email, username, name")
        .eq("username", values.username);

      console.log("Resultado de búsqueda de usuario:", { users, userError });

      if (userError) {
        console.error("Error al buscar usuario:", userError);
        alert("Error al conectar con la base de datos. Intenta nuevamente.");
        return;
      }

      if (!users || users.length === 0) {
        alert("Usuario no encontrado. Verifica tu nombre de usuario.");
        return;
      }

      const user = users[0];
      console.log("Usuario encontrado:", user);

      // Login con el email encontrado
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.password,
      });

      console.log("Resultado de login:", { loginData, loginError });

      if (loginError) {
        console.error("Error en login:", loginError);
        alert("Credenciales incorrectas. Verifica tu contraseña.");
        return;
      }

      if (!loginData.user) {
        alert("Error en el proceso de autenticación.");
        return;
      }

      setUser({
        id: user.id,
        email: user.email,
        name: user.name || user.username,
        username: user.username,
      });

      console.log("Login exitoso, redirigiendo a /chat");
      router.push("/chat");
      
    } catch (error) {
      console.error("Error inesperado durante el login:", error);
      alert("Error inesperado. Intenta nuevamente.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary">
<div className="flex items-center justify-center mt-2 mb-4 w-full" style={{ minHeight: 100 }}>

    <Image src="/img/ZynChat-Logo.png" alt="ZynChat" width={200} height={200} />
  
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
              <Link href="/terms" className="underline hover:text-white">Terms of Use</Link> and{" "}
              <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
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