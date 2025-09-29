"use client";

import React, { useState, useEffect } from "react";

export default function ComingSoonExpenseTracker() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Expense Tracker Budget page - Coming Soon
        </h1>
        <p className="text-gray-600 mb-6">
          We’re preparing a smart and easy-to-use expense tracker to help you
          manage your finances. Join the waitlist to get early access.
        </p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <CounterBox label="Days" value={timeLeft.days} />
          <CounterBox label="Hours" value={timeLeft.hours} />
          <CounterBox label="Mins" value={timeLeft.minutes} />
          <CounterBox label="Secs" value={timeLeft.seconds} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 items-stretch justify-center mb-4"
        >
          <input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            {subscribed ? "You're in!" : "Notify Me"}
          </button>
        </form>

        <p className="text-xs text-gray-500">
          No spam — unsubscribe anytime. ,
          <a href="/Admin">Click here to access Admin</a>
        </p>
        <footer className="mt-6 text-gray-400 text-sm">
          © {new Date().getFullYear()} Expense Tracker
        </footer>
      </div>
    </main>
  );
}

function getTimeLeft() {
  const launch = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();
  const now = Date.now();
  const diff = Math.max(0, launch - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function CounterBox({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center min-w-[60px]">
      <div className="text-xl font-semibold text-gray-800">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
