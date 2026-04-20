import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminPassword || password !== adminPassword) {
    return new NextResponse("Invalid password", { status: 401 });
  }

  const cookieStore = await cookies();
  const expiresAt = Date.now() + 4 * 60 * 60 * 1000;
  cookieStore.set("admin_auth", "authenticated", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 4 * 60 * 60,
  });
  cookieStore.set("admin_auth_expires", String(expiresAt), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 4 * 60 * 60,
  });

  return NextResponse.json({ success: true });
}
