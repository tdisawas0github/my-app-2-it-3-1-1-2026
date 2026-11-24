import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid registration data" },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
