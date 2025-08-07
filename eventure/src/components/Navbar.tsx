"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full border-b py-3 px-4 flex items-center justify-between">
      <Link href="/" className="font-semibold text-lg">Eventure</Link>
      <div className="flex items-center gap-3">
        <Link href="/messages" className="hover:underline">Messages</Link>
        <Link href="/profile" className="hover:underline">Profile</Link>
        {session?.user ? (
          <button className="border rounded px-3 py-1" onClick={() => signOut()}>Sign out</button>
        ) : (
          <Link href="/login" className="border rounded px-3 py-1">Sign in</Link>
        )}
      </div>
    </nav>
  );
}