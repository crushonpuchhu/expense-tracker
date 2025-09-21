import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../model/User.js";
import { connectDB } from "../../../../lib/mongodb.js";
import { signAccessToken, generateRefreshToken } from "../../../../lib/auth.js";
import { setRefreshCookie } from "../../../../lib/cookies";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );

  // Sign access token
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });

  const ip = req.headers.get("x-forwarded-for") || "";
  const ua = req.headers.get("user-agent") || "";

  // Generate refresh token
  const { token: refreshToken } = await generateRefreshToken(
    user._id.toString(),
    ip,
    ua
  );

  // ✅ Await cookie setting
  await setRefreshCookie(refreshToken);

  // Return access token + user info
  return NextResponse.json({
    accessToken,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
