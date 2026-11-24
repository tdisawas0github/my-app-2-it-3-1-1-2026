import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";


export async function POST(request: NextRequest) {
  try {
    await deleteSession();
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(new URL("/auth/login", request.url), 303);
}
