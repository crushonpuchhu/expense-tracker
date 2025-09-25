import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../model/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();
    await connectDB();

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // case 1: only checking if user exists (first call)
    if (!newPassword) {
      return NextResponse.json(
        { success: true, message: "User found. Please provide a new password" },
        { status: 200 }
      );
    }

    // case 2: update password (second call)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Forgot Password API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
