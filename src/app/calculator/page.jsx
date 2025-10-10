"use client";

import { useState } from "react";
import { FiDelete } from "react-icons/fi";
import { BiReset } from "react-icons/bi";

export default function ModernDarkCalculator() {
  const [input, setInput] = useState("");

  const handleClick = (value) => setInput((prev) => prev + value);
  const handleClear = () => setInput("");
  const handleDelete = () => setInput(input.slice(0, -1));
  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(input.replace(/×/g, "*").replace(/÷/g, "/"));
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const numberButtons = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    "0", "."
  ];

  const operatorButtons = ["÷", "×", "-", "+", "="];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm p-6">
        {/* Display */}
        <input
          type="text"
          value={input}
          readOnly
          placeholder="0"
          className="w-full mb-6 p-4 text-right text-3xl rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none"
        />

        {/* Buttons container */}
        <div className="grid grid-cols-3 gap-4">
          {/* Numbers & actions */}
          <div className="col-span-2 grid grid-cols-3 gap-4">
            {/* Clear and Delete */}
            <button
              onClick={handleClear}
              className="flex items-center justify-center p-5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xl shadow-lg transition"
            >
              <BiReset size={24} />
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center p-5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white text-xl shadow-lg transition"
            >
              <FiDelete size={24} />
            </button>
            <div></div> {/* Empty placeholder */}

            {/* Numbers */}
            {numberButtons.map((num, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(num)}
                className="p-5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-2xl shadow-lg transition"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Operators */}
          <div className="flex flex-col gap-4 col-span-1">
            {operatorButtons.map((op, idx) => (
              <button
                key={idx}
                onClick={op === "=" ? handleCalculate : () => handleClick(op)}
                className={`p-5 rounded-xl text-white text-2xl shadow-lg transition ${
                  op === "="
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
