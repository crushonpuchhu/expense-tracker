// app/api/auth/refresh/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/mongodb.js";
import User from "../../../../model/User.js";

export async function POST() {
  await connectDB();
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Optional: validate refresh token with DB (if you save it per user)
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
    }

    // Generate new short-lived access token
    const newAccessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const response = NextResponse.json({ message: "Token refreshed" });

    response.cookies.set({
      name: "accessToken",
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 403 });
  }
}
