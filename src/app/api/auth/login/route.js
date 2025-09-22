// login.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../../model/User.js";
import { connectDB } from "../../../../lib/mongodb.js";
import { signAccessToken, generateRefreshToken } from "../../../../lib/auth.js";
import { setAccessCookie, setRefreshCookie } from "../../../../lib/cookies.js";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ message: "Incorrect password" }, { status: 401 });

  // Access token
  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Device info & IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.socket.remoteAddress || "0.0.0.0";
  const device = req.headers.get("user-agent") || "unknown-device";

  // Refresh token
  const refreshTokenObj = await generateRefreshToken(user._id.toString(), ip, device);

  // Set cookies
  await setAccessCookie(accessToken);
  await setRefreshCookie(refreshTokenObj.token);

  return NextResponse.json({
    message: "Login successful",
    user: { name: user.name, email: user.email, role: user.role },
  });
}
