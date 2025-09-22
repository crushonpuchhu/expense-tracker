"use client";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex justify-center items-center">
            <span className="font-bold text-3xl flex gap-2 justify-center items-center  ">Expense <p className=" font-light text-2xl">Tracker</p></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center font-medium">
            <a
              href="#dashboard"
              className="text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Dashboard
            </a>
            <a
              href="#transactions"
              className="text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Transactions
            </a>
            <a
              href="#budget"
              className="text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Budget
            </a>
            <a
              href="#pro"
              className="text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Pro
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
          <a
            href="#dashboard"
            className="block px-4 py-3 text-gray-800 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300"
          >
            Dashboard
          </a>
          <a
            href="#transactions"
            className="block px-4 py-3 text-gray-800 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300"
          >
            Transactions
          </a>
          <a
            href="#budget"
            className="block px-4 py-3 text-gray-800 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300"
          >
            Budget
          </a>
          <a
            href="#pro"
            className="block px-4 py-3 text-gray-800 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300"
          >
            Pro
          </a>
        </div>
      )}
    </nav>
  );
}
