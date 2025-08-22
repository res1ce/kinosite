"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setError("Неверные данные");
    if (res?.ok) window.location.href = "/admin";
  };

  return (
    <main className="min-h-svh grid place-items-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border bg-white dark:bg-[#111] shadow-xl p-6 md:p-8 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#6E0A6B]">Вход в админ-панель</h1>
          <p className="text-sm text-gray-500 mt-1">Введите свои учетные данные</p>
        </div>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}

        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                 className="rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60"/>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Пароль</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                 className="rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60"/>
        </label>

        <button className="w-full rounded-lg py-2.5 bg-[#6E0A6B] text-white font-medium hover:brightness-110 active:scale-95 transition">
          Войти
        </button>
      </form>
    </main>
  );
}
