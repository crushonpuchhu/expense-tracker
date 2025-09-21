// app/api/auth/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb.js";
import User from "../../../../model/User.js";
import jwt from "jsonwebtoken"; // ✅ Add this

export async function POST() {
  try {
    await connectDB();
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Optional: if refresh token exists, remove it from DB
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken); // ✅ now works
      if (decoded?.userId) {
        await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: "" } });
      }
    }

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear access token
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    // Clear refresh token
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Failed to logout", error: error.message },
      { status: 500 }
    );
  }
}
