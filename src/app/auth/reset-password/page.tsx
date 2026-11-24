import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <Suspense
        fallback={
          <div className="mx-auto mt-16 max-w-md rounded-xl bg-white p-8 shadow-lg">
            Loading...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
