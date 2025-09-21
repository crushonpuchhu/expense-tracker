// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true }, // Food, Bills, Travel
    amount: { type: Number, required: true },
    method: { type: String, enum: ["Cash", "UPI", "Card", "Bank", "Wallet"], default: "Cash" }, // payment mode
    note: { type: String }, // optional description
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ["Income", "Expense"], required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
