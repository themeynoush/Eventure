"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/" });
    if ((res as any)?.error) setError((res as any).error as string);
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="border rounded px-3 py-2" type="submit">Sign in</button>
      </form>
      <div className="text-sm mt-3">No account? <Link className="underline" href="/register">Register</Link></div>
    </div>
  );
}