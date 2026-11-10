"use client";
import { useState } from "react";
export default function HomePage() {
  const [count, setCount] = useState(0);
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-blue-700">
          เรียนรู้ Next.js
        </h1>
        <p className="mt-4 text-slate-600">
          นี่คือเว็บไซต์แรกของฉัน
        </p>
        <p className="mt-6">
          จำนวนครั้งที่กดปุ่ม: {count}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          คลิกเพื่อเพิ่มจำนวน
        </button>
      </div>
    </main>
  );
}
