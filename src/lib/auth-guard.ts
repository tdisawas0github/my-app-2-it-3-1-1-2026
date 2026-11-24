import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    redirect("/unauthorized");
  }

  return user;
}
