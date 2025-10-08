"use client";
import React from "react";

export default function IncomeProgressBar({ percentage=40 }) {
  // Determine bar color based on percentage
  const getBarColor = () => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Income Used
        </span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-300 dark:bg-gray-600 h-4 rounded-lg overflow-hidden">
        <div
          className={`${getBarColor()} h-4 rounded-lg transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
