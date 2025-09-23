"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Progress,
} from "@heroui/react";

export default function BudgetPage() {
  const initialCategories = [
    { name: "Groceries", budget: 5000, spent: 3200, color: "bg-green-500" },
    { name: "Entertainment", budget: 2000, spent: 1500, color: "bg-pink-500" },
    { name: "Utilities", budget: 3000, spent: 2800, color: "bg-blue-500" },
  ];

  const [categories, setCategories] = useState(initialCategories);

  const handleBudgetChange = (index, value) => {
    const updated = [...categories];
    updated[index].budget = Number(value);
    setCategories(updated);
  };

  const handleSendBudget = () => {
    console.log("Saving budget data:", categories);
    alert("Budget saved successfully!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Budget Management
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Section 1: Set Budgets */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Set Budgets</h2>
          {categories.map((cat, index) => (
            <Card key={cat.name} className="shadow-md">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{cat.name}</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <Input
                  type="number"
                  value={cat.budget}
                  onChange={(e) => handleBudgetChange(index, e.target.value)}
                  label="Set Budget"
                  labelPlacement="outside"
                  startContent={<span className="text-gray-500">₹</span>}
                />
              </CardBody>
            </Card>
          ))}
          <Button color="primary" fullWidth onPress={handleSendBudget}>
            Save All Budgets
          </Button>
        </div>

        {/* Section 2: Budget Overview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Spending Overview
          </h2>
          {categories.map((cat) => {
            const spentPercentage = Math.min((cat.spent / cat.budget) * 100, 100);
            const remaining = cat.budget - cat.spent;
            const isOverBudget = remaining < 0;

            return (
              <Card key={cat.name} className="shadow-md">
                <CardHeader className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  <span
                    className={`font-semibold ${
                      isOverBudget ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {isOverBudget ? `Over by ₹${Math.abs(remaining)}` : `₹${remaining} left`}
                  </span>
                </CardHeader>
                <CardBody className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Budget: <strong className="text-gray-800">₹{cat.budget}</strong>
                    </span>
                    <span className="text-gray-500">
                      Spent: <strong className="text-gray-800">₹{cat.spent}</strong>
                    </span>
                  </div>
                  <Progress
                    value={spentPercentage}
                    color={isOverBudget ? "danger" : "primary"}
                    className="mb-1"
                    showValueLabel
                  />
                  <p className="text-right text-xs text-gray-500">
                    {spentPercentage.toFixed(0)}% of budget used
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}