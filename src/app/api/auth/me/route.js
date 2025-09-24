// app/api/auth/me/route.js
import { NextResponse } from "next/server";// wherever you put it
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; // ✅ missing import

async function verifyAccessToken() {
  const cookieStore = await cookies(); // must await
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) throw new Error("Unauthorized");

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  return decoded; // decoded.sub should be userId
}

export async function GET() {
  try {
    const decoded = await verifyAccessToken();

    return NextResponse.json({ user: decoded });
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
