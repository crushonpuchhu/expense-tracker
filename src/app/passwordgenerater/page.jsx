"use client";

import { useState } from "react";
import { ShieldCheck, XCircle, AlertTriangle, Copy, RefreshCcw } from "lucide-react";

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [copied, setCopied] = useState(false);

  const specialChars = "!@#$%^&*()_+[]{}|;:'\",.<>?/";

  // Check password strength based on rules
  const checkStrength = (pwd) => {
    if (!pwd) return "";
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = new RegExp(
      "[" + specialChars.split("").map((c) => "\\" + c).join("") + "]"
    ).test(pwd);
    const validLength = pwd.length === 8;

    if (validLength && hasUpper && hasLower && hasDigit && hasSpecial) return "strong";
    if ((hasUpper || hasLower || hasDigit || hasSpecial) && pwd.length >= 4) return "medium";
    return "weak";
  };

  const getColor = () => {
    switch (strength) {
      case "weak":
        return "bg-red-500 text-red-100";
      case "medium":
        return "bg-yellow-400 text-yellow-900";
      case "strong":
        return "bg-green-500 text-green-100";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const getIcon = () => {
    switch (strength) {
      case "weak":
        return <XCircle className="w-8 h-8 text-red-600" />;
      case "medium":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      case "strong":
        return <ShieldCheck className="w-8 h-8 text-green-600" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleChange = (e) => {
    let value = e.target.value.replace(/\s/g, "").slice(0, 8); // no spaces, max 8
    setPassword(value);
    setStrength(checkStrength(value));
  };

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const allSpecial = specialChars;
    const all = upper + lower + digits + allSpecial;

    let pwd = "";
    // Ensure at least one of each type
    pwd += upper.charAt(Math.floor(Math.random() * upper.length));
    pwd += lower.charAt(Math.floor(Math.random() * lower.length));
    pwd += digits.charAt(Math.floor(Math.random() * digits.length));
    pwd += allSpecial.charAt(Math.floor(Math.random() * allSpecial.length));

    // Fill remaining to reach 8 characters
    while (pwd.length < 8) {
      pwd += all.charAt(Math.floor(Math.random() * all.length));
    }

    // Shuffle password
    pwd = pwd.split("").sort(() => Math.random() - 0.5).join("");

    setPassword(pwd);
    setStrength(checkStrength(pwd));
    setCopied(false);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Password Strength Checker and Generate</h1>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-lg w-full max-w-lg">
        {/* Input + Copy + Generate */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={password}
            onChange={handleChange}
            placeholder="Enter password"
            className="flex-1 p-4 rounded-xl bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            onClick={copyPassword}
            className="p-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition flex items-center justify-center"
          >
            <Copy className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={generatePassword}
            className="p-3 rounded-xl bg-green-500 hover:bg-green-600 transition flex items-center justify-center"
          >
            <RefreshCcw className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Strength Bar */}
        <div className="h-4 w-full bg-gray-300 rounded-full mb-4">
          <div
            className={`h-4 rounded-full transition-all ${getColor()}`}
            style={{
              width:
                strength === "weak"
                  ? "33%"
                  : strength === "medium"
                  ? "66%"
                  : strength === "strong"
                  ? "100%"
                  : "0%",
            }}
          ></div>
        </div>

        {/* Icon + Text */}
        {password.length > 0 && (
          <div
            className={`flex items-center gap-4 p-3 rounded-xl ${getColor()} transition`}
          >
            <div>{getIcon()}</div>
            <span className="font-semibold capitalize">{strength}</span>
            {copied && <span className="ml-auto text-sm text-gray-800">Copied!</span>}
          </div>
        )}

        {/* Rules */}
        <div className="mt-6 text-gray-700 text-sm">
          <p className="mb-2 font-semibold">Password Rules:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Exactly 8 characters</li>
            <li>At least one uppercase letter (A–Z)</li>
            <li>At least one lowercase letter (a–z)</li>
            <li>At least one digit (0–9)</li>
            <li>At least one special character ({"!@#$%^&*()_+[]{}|;:'\",.<>?/"})</li>
            <li>No spaces allowed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
