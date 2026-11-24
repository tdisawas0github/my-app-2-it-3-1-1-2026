import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { forgotPasswordSchema } from "@/lib/validation";
import { hashToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/email";


const RESET_TOKEN_DURATION = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = result.data;
    await connectDB();

    const user = await User.findOne({ email, isActive: true });

    // Always return the same response so the endpoint cannot be used to
    // discover which email addresses are registered.
    const genericResponse = NextResponse.json({
      message:
        "If an account exists for that email, a reset link has been sent.",
    });

    if (!user) {
      return genericResponse;
    }

    await PasswordResetToken.deleteMany({ userId: user._id });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_DURATION);

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash: hashToken(token),
      expiresAt,
    });

    const appUrl = process.env.APP_URL ?? request.nextUrl.origin;
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
      await PasswordResetToken.deleteMany({ userId: user._id });
      console.error("Password reset email error:", error);
      return NextResponse.json(
        { message: "Unable to send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return genericResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
