import { NextResponse } from "next/server";
import {connectDB} from "../../../lib/mongodb";
import { cookies } from "next/headers";
import { verifyAccessToken } from "../../../lib/auth";
import User from "../../../model/User";
import Transaction from "../../../model/Transaction";
import Session from "../../../model/Session";

async function getDecodedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) throw new Error("Unauthorized");

  return verifyAccessToken(token);
}

export async function GET() {
  try {
    const decoded = await getDecodedUser(); // get user info from token
    await connectDB();

    // Only allow admins
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // Fetch all users and transactions
    const users = await User.find({}).select("-password");
    const transactions = await Transaction.find({});

    return NextResponse.json({
      success: true,
      data: {
        users,
        transactions,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: err.message === "Unauthorized" ? 401 : 500 }
    );
  }
}

export async function DELETE(request) {
  try {
  const decoded = await getDecodedUser(); // get user info from token
    await connectDB();

    // Only allow admins
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    
 // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Optional: Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all transactions of this user
    await Transaction.deleteMany({ userId });

    // Delete all sessions (refresh tokens) for this user
    await Session.deleteMany({ userId });

    // Delete user profile
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User account and all data deleted permanently" });
  } catch (err) {
    console.error("Delete account failed:", err);
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
  }
}