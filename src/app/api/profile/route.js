// app/api/profile/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "../../../lib/mongodb.js";
import User from "../../../model/User.js";
import bcrypt from "bcryptjs";
import Transaction from "../../../model/Transaction.js";
import { verifyAccessToken, revokeAllSessionsForUser } from "../../../lib/auth.js";
// Helper to verify JWT access token
async function verifyAccessToken() {
  const cookieStore = await cookies(); // ✅ must await
  const token = cookieStore.get("accessToken")?.value;
  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
}

// GET profile
export async function GET() {
  try {
    const decoded = await verifyAccessToken();

    await connectDB();
    const user = await User.findById(decoded.sub).select("-password"); // sub = userId in JWT

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Invalid token" }, { status: 401 });
  }
}

// PATCH update profile
export async function PATCH(req) {
  try {
    const decoded = await verifyAccessToken();
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

      const hashedPassword = await bcrypt.hash(newPassword, 8);
      updateFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.sub, updateFields, { new: true }).select("-password");

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Profile update failed:", err);
    return NextResponse.json({ error: err.message || "Update failed" }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    // Verify the access token
    const decoded = await verifyAccessToken();

    // Connect to MongoDB
    await connectDB();

    const userId = decoded.sub;

    // Delete user document
    await User.findByIdAndDelete(userId);

    // Delete all transactions for the user
    await Transaction.deleteMany({ userId });

    // Revoke all sessions (refresh tokens)
    await revokeAllSessionsForUser(userId);

    // Clear cookies
    const res = NextResponse.json({ message: "Account deleted permanently" });
    res.cookies.set({
      name: "accessToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    res.cookies.set({
      name: "refreshToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Delete account failed:", err);
    return NextResponse.json(
      { error: err.message || "Delete failed" },
      { status: 400 }
    );
  }
}

