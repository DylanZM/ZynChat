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
  FormField,    
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm your password." }),
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
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  async function onSubmit(values: any) {
    try {
      console.log("Intentando registro con:", { email: values.email, username: values.username });
      
      // Verificar si el username ya existe
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("username")
        .eq("username", values.username);

      if (checkError) {
        console.error("Error verificando username:", checkError);
        alert("Error verificando disponibilidad del username. Intenta nuevamente.");
        return;
      }

      if (existingUsers && existingUsers.length > 0) {
        alert("Este nombre de usuario ya está en uso. Elige otro.");
        return;
      }

      console.log("Username disponible, procediendo con registro...");

      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.username,
            username: values.username,
          },
        },
      });

      console.log("Resultado de signUp:", { data, error });

      if (error) {
        console.error("Error en signUp:", error);
        alert(`Error en el registro: ${error.message}`);
        return;
      }

      // Inserta en users si el usuario fue creado
      if (data.user) {
        console.log("Usuario creado en Auth, insertando en tabla users...");
        
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            username: values.username,
            email: values.email,
            name: values.username,
          },
        ]);

        console.log("Resultado de inserción en users:", { insertError });

        if (insertError) {
          console.error("Error insertando en users:", insertError);
          if (!insertError.message.includes("duplicate key")) {
            alert("Error guardando usuario en la base de datos: " + insertError.message);
            return;
          }
        }

        setUser({
          id: data.user.id,
          email: data.user.email ?? "",
          name: data.user.user_metadata?.name || values.username,
        });

        console.log("Registro exitoso, redirigiendo a /chat");
        router.push("/chat");
      } else {
        console.error("No se pudo crear el usuario en Auth");
        alert("No se pudo crear el usuario. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error inesperado durante el registro:", error);
      alert("Error inesperado durante el registro. Intenta nuevamente.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary">
   <div className="flex items-center justify-center mt-2 mb-4 w-full" style={{ minHeight: 100 }}>
  
    <Image src="/img/ZynChat-Logo.png" alt="ZynChat" width={200} height={200} />
  
</div>
      <div className="w-full max-w-md rounded-xl bg-secondary p-8 shadow-lg">
        <p className="mb-6 text-sm text-white">
          Only email registration is supported in your region. One Zynchat account is all you need to access to all Zynchat services.
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
            <p className="text-xs text-neutral-400 pt-2">
              By creating an account, you agree to our{" "}
              <a href="/terms" className="underline hover:text-white">Terms of Use</a> and{" "}
              <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>.
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