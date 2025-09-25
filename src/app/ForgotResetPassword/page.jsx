"use client"; // 👈 Add this line at the very top

import { useState } from "react";
import { KeyRound, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Loading from "../../component/LodingUi/Loding";
import { addToast } from "@heroui/react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=password, 3=done
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email !== "") {
      try {
        setLoading(true);

        // simulate email check
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, newPassword: null }),
        });

        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setStep(2);
        } else {
          setLoading(false);
          addToast({
            title: "Error",
            description: data.message,
            color: "danger",
          });
        }
      } catch (error) {
        setLoading(false);
        addToast({
          title: "Error",
          description: "somthing went wrong",
          color: "danger",
        });
      }
    } else {
      addToast({
        title: "Error",
        description: "All field is requred",
        color: "danger",
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== "" && confirm !== "") {
      if (password !== confirm) {
        addToast({
          title: "Error",
          description: "Passwords do not match",
          color: "danger",
        });
        return;
      }

      try {
        setLoading(true);
        // simulate email check
        const res = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, newPassword: password }),
        });

        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          addToast({
            title: "success",
            description: data.message,
            color: "success",
          });
          setStep(3);
        } else {
          setLoading(false);
          addToast({
            title: "Error",
            description: data.message,
            color: "danger",
          });
        }
      } catch (error) {
        setLoading(false);
        addToast({
          title: "error",
          description: "somthing went wrong",
          color: "danger",
        });
      }

      // simulate password reset
    } else {
      addToast({
        title: "Error",
        description: "All field is requred",
        color: "danger",
      });
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gradient-to-t from-gray-100 to-gray-200 px-4">
      {loading ? <Loading /> : null}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mx-auto mb-4">
            <KeyRound className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {step === 1 && "Forgot your password?"}
            {step === 2 && "Set a New Password"}
            {step === 3 && "Password Reset Successful"}
          </h1>
          <p className="text-gray-600">
            {step === 1 &&
              "Enter your email address and we’ll send you a reset link."}
            {step === 2 && "Enter your new password below."}
            {step === 3 && "Your password has been reset. You can now sign in."}
          </p>
        </div>

        {/* Step 1 - Email form */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-5 text-left">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:bg-blue-300"
            >
              {loading ? "Checking..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Step 2 - New Password form */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5 text-left">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                <input
                  type="password"
                  id="confirm"
                  required
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:bg-blue-300"
            >
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Step 3 - Success message */}
        {step === 3 && (
          <div className="bg-green-100 text-green-700 rounded-lg p-4 text-sm mt-4">
            Password reset successful! You can now{" "}
            <Link href="/LoginPage" className="font-medium underline">
              sign in
            </Link>
            .
          </div>
        )}

        {/* Footer */}
        {step !== 3 && (
          <div className="mt-6">
            <Link
              href="/LoginPage"
              className="text-blue-600 font-medium hover:underline"
            >
              &larr; Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
