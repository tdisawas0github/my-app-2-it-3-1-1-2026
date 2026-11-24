"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/auth/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-4 text-slate-600">
          You are logged in. Visit your{" "}
          <Link href="/profile" className="text-blue-600">
            profile
          </Link>
          .
        </p>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </main>
  );
}
