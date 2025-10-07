"use client";

import { useState, useRef, useEffect } from "react";

export default function BalanceCheck() {
  const [pin, setPin] = useState(Array(6).fill(""));
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  // Handle input
  const handleChange = (e, idx) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newPin = [...pin];
      newPin[idx] = val;
      setPin(newPin);
      if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.some((d) => d === "")) {
      alert("Enter all 6 digits");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBalance("₹100000.75"); // Example balance
    }, 1500); // simulate API delay
  };

  const reset = () => {
    setPin(Array(6).fill(""));
    setBalance(null);
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  };

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f11] flex flex-col justify-between items-center px-4 sm:px-6">
      {/* Header */}
      <div className="w-full py-6 flex flex-col items-center border-b border-[#222]">
        <div className="bg-[#7a003c] w-12 h-12 flex items-center justify-center rounded-full mb-2">
          <span className="text-yellow-400 font-bold text-lg">P</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-100 text-center">Punjab National Bank</h1>
        <p className="text-sm text-gray-400 mt-1 text-center">UPI Balance Check</p>
      </div>

      {/* Main Section */}
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md mt-12">
        {!balance && !loading ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8">
            <p className="text-gray-400 text-sm text-center">Enter 6-digit UPI PIN</p>

            {/* PIN Underline Input */}
            <div className="flex justify-between w-full max-w-xs">
              {pin.map((digit, idx) => (
                <div key={idx} className="flex-1 mx-1 border-b-2 border-gray-600 h-12 flex items-center justify-center">
                  <input
                    ref={(el) => (inputsRef.current[idx] = el)}
                    type="password"
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    maxLength={1}
                    className="w-full h-full text-center text-xl bg-transparent outline-none border-none text-gray-100"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="mt-10 w-full py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all text-lg"
            >
              Check Balance
            </button>
          </form>
        ) : loading ? (
          // Loading skeleton
          <div className="w-full max-w-md flex flex-col items-center gap-4">
            <p className="bg-gray-700 h-5 w-40 rounded-md animate-pulse mb-4"></p>
            <div className="flex justify-between w-full max-w-xs">
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 mx-1 h-12 bg-gray-700 rounded-md animate-pulse"
                  ></div>
                ))}
            </div>
            <div className="mt-10 w-full h-12 bg-purple-600 rounded-lg animate-pulse"></div>
          </div>
        ) : (
          // Show balance
          <div className="text-center w-full max-w-md">
            <p className="text-gray-400 mb-2">Your Current Balance</p>
            <h2 className="text-4xl font-bold text-green-400 mb-1">{balance}</h2>
            <p className="text-xs text-gray-500">Updated just now</p>

            <button
              onClick={reset}
              className="mt-6 w-full py-3 rounded-lg border border-purple-600 text-purple-400 hover:bg-purple-900/30 transition-all text-lg"
            >
              Check Again
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full py-3 text-center border-t border-[#222] text-xs text-gray-600">
        🔒 Secure Demo — No real bank data.
      </div>
    </div>
  );
}
