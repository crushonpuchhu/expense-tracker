"use client";
import { useState } from "react";
import { Button, Input, Tabs, Tab } from "@heroui/react";

export default function ForgotResetPassword() {
  const [email, setEmail] = useState("");
  const [reset, setReset] = useState({ password: "", confirm: "" });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Password Recovery
        </h1>

        <Tabs
          aria-label="Password Options"
          color="primary"
          className="bg-gray-50 rounded-xl p-2 mb-4"
        >
          {/* Forgot Password */}
          <Tab key="forgot" title="Forgot Password">
            <p className="text-gray-600 mb-4 text-sm text-center">
              Enter your email to receive a password reset link.
            </p>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <Button
              fullWidth
              color="primary"
              className="py-2 rounded-lg font-semibold"
            >
              Send Reset Link
            </Button>
          </Tab>

          {/* Reset Password */}
          <Tab key="reset" title="Reset Password">
            <p className="text-gray-600 mb-4 text-sm text-center">
              Enter your new password below.
            </p>
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={reset.password}
              onChange={(e) =>
                setReset({ ...reset, password: e.target.value })
              }
              className="mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              value={reset.confirm}
              onChange={(e) =>
                setReset({ ...reset, confirm: e.target.value })
              }
              className="mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <Button
              fullWidth
              color="success"
              className="py-2 rounded-lg font-semibold"
            >
              Reset Password
            </Button>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
