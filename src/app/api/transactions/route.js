import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/mongodb.js";
import Transaction from "../../../model/Transaction.js";

// Helper function to verify access token
async function verifyAccessToken() {
  const cookieStore = cookies(); // ✅ App Router server-side cookies
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) throw new Error("Unauthorized");

  return jwt.verify(accessToken, process.env.JWT_SECRET);
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
        { message: "Type is required and must be 'Income' or 'Expense'" },
        { status: 400 }
      );
    }

    const newTransaction = await Transaction.create({
      userId: decoded.userId,
      category,
      amount,
      method: method || "Cash",
      note,
      date: date ? new Date(date) : new Date(),
      type,
    });

    return NextResponse.json(
      { message: "Transaction added", transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error("Transaction error:", error.message, error.stack);
    return NextResponse.json(
      { message: "Failed to add transaction", error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all transactions for logged-in user
export async function GET() {
  try {
    await connectDB();
    const decoded = await verifyAccessToken();

    const transactions = await Transaction.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions", error: error.message },
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

    if (!transactionId) {
      return NextResponse.json(
        { message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: decoded.userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: "Transaction not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { message: "Failed to delete transaction", error: error.message },
      { status: 500 }
    );
  }
}
