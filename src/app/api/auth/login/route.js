// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb.js";
import User from "../../../../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }

    // Access Token (short-lived)
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET, // 🔑 Use a different secret
      { expiresIn: "7d" }
    );

    // Save refresh token in DB (optional for invalidation)
    user.refreshToken = refreshToken;
    await user.save();

    const cookieStore = await cookies();

    // Access token cookie
    cookieStore.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    });

    // Refresh token cookie
    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ message: "Login successful" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
