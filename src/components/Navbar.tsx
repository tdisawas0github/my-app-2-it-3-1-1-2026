"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "หน้าแรก" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อเรา" },
  { href: "/login", label: "เข้าสู่ระบบ" },
  { href: "/register", label: "สมัคร" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-700">
          เรียนรู้ Next.js
        </Link>
        <ul className="flex flex-wrap items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
