import "server-only";
import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;
const COOKIE_NAME = "session";

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

// Create Session
export async function createSession(userId: string) {
  await connectDB();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION
  );

  await Session.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Get Current User
export async function getCurrentUser() {
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  await connectDB();
  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });

  if (!session) return null;
  const user = await User.findById(session.userId)
    .select("name email role isActive");
  if (!user || !user.isActive) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// Delete Session
export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await connectDB();
    await Session.deleteOne({
      tokenHash: hashToken(token),
    });
  }
  cookieStore.delete(COOKIE_NAME);
}
