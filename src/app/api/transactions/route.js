import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/mongodb.js";
import Transaction from "../../../model/Transaction.js";

// Helper: Verify JWT access token from cookie
async function verifyAccessToken() {
  const cookieStore = await cookies(); // must await
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) throw new Error("Unauthorized");

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  return decoded; // decoded.sub should be userId
}

// Helper: Set accessToken cookie
export async function setAccessTokenCookie(token) {
  const cookieStore = cookies();
  await cookieStore.set({
    name: "accessToken",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

// POST: Add new transaction
export async function POST(req) {
  try {
    await connectDB();
    const decoded = await verifyAccessToken();
    const { category, amount, note, date, method, type } = await req.json();

    if (!category || !amount) {
      return NextResponse.json(
        { message: "Category and Amount are required" },
        { status: 400 }
      );
    }

    if (!type || !["Income", "Expense"].includes(type)) {
      return NextResponse.json(
        { message: "Type must be 'Income' or 'Expense'" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      userId: decoded.sub,
      category,
      amount,
      method: method || "Cash",
      note,
      date: date ? new Date(date) : new Date(),
      type,
    });

    return NextResponse.json({ transaction: newTransaction }, { status: 201 });
  } catch (err) {
    console.error("Transaction POST Error:", err);
    return NextResponse.json(
      { message: "Failed to add transaction", error: err.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all transactions for logged-in user
export async function GET() {
  try {
    await connectDB();
    const decoded = await verifyAccessToken();

    const transactions = await Transaction.find({ userId: decoded.sub }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (err) {
    console.error("Transaction GET Error:", err);
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a transaction
export async function DELETE(req) {
  try {
    await connectDB();
    const decoded = await verifyAccessToken();
    const { transactionId } = await req.json();

    if (!transactionId)
      return NextResponse.json(
        { message: "Transaction ID required" },
        { status: 400 }
      );

    const deleted = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: decoded.sub,
    });

    if (!deleted)
      return NextResponse.json(
        { message: "Transaction not found or not authorized" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
  } catch (err) {
    console.error("Transaction DELETE Error:", err);
    return NextResponse.json(
      { message: "Failed to delete transaction", error: err.message },
      { status: 500 }
    );
  }
}
