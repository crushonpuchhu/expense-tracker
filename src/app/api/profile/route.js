// app/api/profile/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "../../../lib/mongodb.js";
import User from "../../../model/User.js";
import bcrypt from "bcryptjs";
import Transaction from "../../../model/Transaction.js";
import { verifyAccessToken, revokeAllSessionsForUser } from "../../../lib/auth.js";
import Session from "../../../model/Session.js";

// Helper: decode user from access token in cookies
async function getDecodedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) throw new Error("Unauthorized");

  return verifyAccessToken(token);
}

// GET: fetch profile
export async function GET() {
  try {
    const decoded = await getDecodedUser();
    await connectDB();

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Invalid token" }, { status: 401 });
  }
}

// PATCH: update profile
export async function PATCH(req) {
  try {
    const decoded = await getDecodedUser();
    const { name, currentPassword, newPassword } = await req.json();

    if (!name && !newPassword) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await connectDB();
    const updateFields = {};

    if (name) updateFields.name = name;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 });
      }

      const user = await User.findById(decoded.sub);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });

      updateFields.password = await bcrypt.hash(newPassword, 8);
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.sub, updateFields, { new: true }).select("-password");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Profile update failed:", err);
    return NextResponse.json({ error: err.message || "Update failed" }, { status: 400 });
  }
}

// DELETE: delete user account
export async function DELETE() {
  try {
    const decoded = await getDecodedUser();
    const userId = decoded.sub;

    await connectDB();

    // Delete user and transactions
    await User.findByIdAndDelete(userId);
    await Transaction.deleteMany({ userId });

    // Revoke all sessions (refresh tokens) for this user
    // await revokeAllSessionsForUser(userId);
    await Session.deleteMany({userId});

    // Clear cookies
    const res = NextResponse.json({ message: "Account deleted permanently" });
    ["accessToken", "refreshToken"].forEach((name) => {
      res.cookies.set({
        name,
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
    });

    return res;
  } catch (err) {
    console.error("Delete account failed:", err);
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 400 });
  }
}
