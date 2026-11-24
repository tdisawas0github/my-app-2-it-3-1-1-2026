import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid login data" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    await connectDB();
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: "Invalid email or password" },{ status: 401 }
      );
    }

    const validPassword = await verifyPassword(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },{ status: 401 }
      );
    }

    // Create database session and HttpOnly cookie
    await createSession(user._id.toString());
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
