"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      setMessage(data.message);
      setEmail("");
    } catch {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Forgot Password
      </h1>
      <p className="mb-6 text-center text-sm text-slate-600">
        Enter your email address and we&apos;ll send you a reset link.
      </p>
      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm">
        <Link href="/auth/login" className="text-blue-600">
          Back to login
        </Link>
      </div>
    </div>
  );
}
