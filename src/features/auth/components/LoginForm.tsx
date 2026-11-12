"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setError(null);
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.error) {
      setError("E-mail ou senha incorretos");
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>Entrar</h1>

      <label>
        E-mail
        <input type="email" autoComplete="email" {...register("email")} />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </label>

      <label>
        Senha
        <input type="password" autoComplete="current-password" {...register("password")} />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <p className="auth-link">
        Não tem conta? <Link href="/cadastro">Cadastre-se</Link>
      </p>
    </form>
  );
}
