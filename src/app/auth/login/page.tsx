/*export default function AboutPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        เข้าสู่ระบบ
      </h1>
      <p className="mt-4">
        เว็บไซต์นี้พัฒนาด้วย Next.js
      </p>
    </main>
  );
}
*/
import LoginForm from "@/components/auth/LoginForm";
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <LoginForm />
    </main>
  );
}
