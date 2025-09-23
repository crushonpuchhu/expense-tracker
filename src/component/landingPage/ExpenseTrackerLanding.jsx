"use client";

import { useState } from "react";

export default function ExpenseTrackerLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          {/* Brand with gradient */}
          <a className="font-bold text-xl " href="/">
            Expense <span className="font-light">Tracker</span>
          </a>

          {/* CTA */}
          <div className="hidden md:flex gap-3">
            <a
              href="/LoginPage"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
            >
              Login
            </a>
            <a
              href="/CreateAccount"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
            >
              Create Account →
            </a>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 grid place-items-center border border-slate-300 rounded-lg text-slate-700"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-100/80 border-t border-slate-200 px-4 py-3 space-y-2 text-slate-700">
            <a
              href="/LoginPage"
              className="block w-full px-4 py-2 rounded-lg border border-slate-300 text-center hover:bg-slate-200 transition"
            >
              Login
            </a>
            <a
              href="/CreateAccount"
              className="block w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold shadow transition"
            >
              Create Account →
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <main id="main">
        <section className="max-w-6xl mx-auto px-4 py-16 grid gap-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Track spending effortlessly and grow your savings with confidence
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto md:mx-0">
            Expense Tracker brings your money into focus. Categorize purchases,
            set monthly budgets, and visualize progress in real time—across
            devices.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href="/CreateAccount"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow text-white transition"
            >
              Start Tracking Free
            </a>
            <a
              href="/LoginPage"
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            >
              Login
            </a>
          </div>

          {/* Showcase */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xl grid md:grid-cols-2 gap-6 mt-12">
            {/* Budget card */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>Monthly Budget</span>
                <span>₹2,000</span>
              </div>
              <div className="flex justify-between text-red-600 mt-2">
                <small>Spent</small>
                <strong>₹1,240</strong>
              </div>
              <div className="flex justify-between text-green-600 mt-2">
                <small>Remaining</small>
                <span className="px-2 py-1 bg-green-100 border border-green-300 rounded-md text-green-700">
                  ₹760
                </span>
              </div>
              <div className="mt-6 h-40 bg-slate-100 rounded-lg grid place-items-center text-slate-500 text-sm">
                [Chart Here]
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
              {/* Transaction 1 */}
              <div className="border-b border-slate-200 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <strong className="font-semibold text-slate-800">Groceries</strong>
                  <span className="text-sm text-red-600 font-semibold">
                    -₹82.40
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-300">
                    Food
                  </span>
                  <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs rounded-full border border-sky-300">
                    Essentials
                  </span>
                </div>
              </div>
              {/* Transaction 2 */}
              <div className="border-b border-slate-200 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <strong className="font-semibold text-slate-800">Transit Pass</strong>
                  <span className="text-sm text-red-600 font-semibold">
                    -₹49.00
                  </span>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-300">
                  Transport
                </span>
              </div>
              {/* Transaction 3 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <strong className="font-semibold text-slate-800">Freelance</strong>
                  <span className="text-sm text-green-600 font-semibold">
                    +₹320.00
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full border border-emerald-300">
                    Income
                  </span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-300">
                    Side-hustle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
