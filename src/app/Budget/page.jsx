"use client";
import { useState } from "react";
import { Button, Input, Progress } from "@heroui/react";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([
    { id: 1, category: "Food", limit: 10000, spent: 8200 },
    { id: 2, category: "Travel", limit: 5000, spent: 3000 },
    { id: 3, category: "Shopping", limit: 7000, spent: 7100 },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Budgets</h1>

      <div className="space-y-6">
        {budgets.map((b) => {
          const percent = (b.spent / b.limit) * 100;
          const color =
            percent >= 100 ? "danger" : percent >= 80 ? "warning" : "success";
          return (
            <div key={b.id} className="p-4 rounded-xl shadow bg-white">
              <div className="flex justify-between mb-2">
                <p className="font-semibold">{b.category}</p>
                <p>
                  ₹{b.spent} / ₹{b.limit}
                </p>
              </div>
              <Progress value={percent} color={color} />
              {percent >= 100 && (
                <p className="text-danger text-sm mt-2">⚠ Budget exceeded!</p>
              )}
              {percent >= 80 && percent < 100 && (
                <p className="text-warning text-sm mt-2">⚠ 80% of budget used</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
