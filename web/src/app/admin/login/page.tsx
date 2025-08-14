"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) setError("Неверные данные");
    if (res?.ok) window.location.href = "/admin";
  };

  return (
    <main className="min-h-svh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-medium">Вход в админ-панель</h1>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
        <label className="block">
          <span className="text-sm">Email</span>
          <input className="mt-1 w-full border rounded px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="block">
          <span className="text-sm">Пароль</span>
          <input className="mt-1 w-full border rounded px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="w-full bg-black text-white py-2 rounded">Войти</button>
      </form>
    </main>
  );
}


