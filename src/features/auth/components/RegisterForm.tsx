"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, type RegisterFormInput } from "../schemas/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerFormSchema) });

  async function onSubmit({ name, email, password }: RegisterFormInput) {
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.message ?? "Não foi possível criar a conta");
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1>Criar conta</h1>

      <label>
        Nome
        <input type="text" autoComplete="name" {...register("name")} />
        {errors.name && <span className="field-error">{errors.name.message}</span>}
      </label>

      <label>
        E-mail
        <input type="email" autoComplete="email" {...register("email")} />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </label>

      <label>
        Senha
        <input type="password" autoComplete="new-password" {...register("password")} />
        {errors.password && <span className="field-error">{errors.password.message}</span>}
      </label>

      <label>
        Confirmar senha
        <input type="password" autoComplete="new-password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span className="field-error">{errors.confirmPassword.message}</span>
        )}
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar conta"}
      </button>

      <p className="auth-link">
        Já tem conta? <Link href="/login">Entrar</Link>
      </p>
    </form>
  );
}
