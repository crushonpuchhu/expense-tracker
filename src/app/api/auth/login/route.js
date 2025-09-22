// app/api/auth/login/route.js
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
  if (!user) return NextResponse.json({ message: "Invalid email or username" }, { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ message: "Incorrect Password" }, { status: 401 });

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshTokenObj = await generateRefreshToken(user._id.toString(), req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress, req.headers["user-agent"] || "unknown-device");


  // ✅ set cookies properly
  await setAccessCookie(accessToken);
  await setRefreshCookie(refreshTokenObj.token);

  return NextResponse.json({
    message: "Login successful",
    user: {
      name: user.name,
      role: user.role,
      email: user.email,
    },
  });
}
