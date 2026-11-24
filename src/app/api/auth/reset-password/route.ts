import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import Session from "@/models/Session";
import { resetPasswordSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/password";
import { hashToken } from "@/lib/token";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid reset data" },
        { status: 400 }
      );
    }

    const { token, password } = result.data;
    await connectDB();

    const resetToken = await PasswordResetToken.findOne({
      tokenHash: hashToken(token),
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    const user = await User.findById(resetToken.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    user.passwordHash = await hashPassword(password);
    await user.save();

    // Invalidate the reset token and all existing sessions for this user.
    await PasswordResetToken.deleteMany({ userId: user._id });
    await Session.deleteMany({ userId: user._id });

    return NextResponse.json({
      message: "Password updated. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
