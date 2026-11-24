import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <Suspense fallback={<DashboardDetailsSkeleton />}>
          <DashboardDetails />
        </Suspense>
      </div>
    </main>
  );
}

async function DashboardDetails() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <p className="mt-4">
        Welcome, {user.name}
      </p>
      <p className="mt-2 text-slate-500">
        Email: {user.email}
      </p>
      <p className="mt-2">
        Role: {user.role}
      </p>
      <div className="mt-6">
        <LogoutButton />
      </div>
    </>
  );
}

function DashboardDetailsSkeleton() {
  return (
    <div className="mt-4 space-y-3" aria-hidden>
      <div className="h-5 w-56 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-6 h-10 w-28 animate-pulse rounded bg-slate-200" />
    </div>
  );
}
