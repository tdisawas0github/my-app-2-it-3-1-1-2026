"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      setSuccess("Registration successful. You can now log in.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">Register</h1>
      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-lg border p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password (at least 12 characters)"
          className="w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={12}
          maxLength={72}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full rounded-lg border p-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          minLength={12}
          maxLength={72}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600">
          Login
        </Link>
      </div>
    </div>
  );
}
