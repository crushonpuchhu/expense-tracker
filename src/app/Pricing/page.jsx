// src/app/pricing/page.jsx
"use client";
import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react"; // npm install lucide-react

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      subtitle: "For personal use",
      price: 0,
      yearlyPrice: 0,
      gradient: "from-pink-500 via-red-500 to-yellow-400",
      features: [
        "Track unlimited expenses",
        "Basic dashboard",
        "Export to CSV",
        "Mobile responsive",
      ],
    },
    {
      name: "Pro",
      subtitle: "Best for individuals & freelancers",
      price: 12,
      yearlyPrice: 120,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      features: [
        "Everything in Free",
        "AI-powered spending insights",
        "Custom categories",
        "Unlimited bank accounts",
        "Priority email support",
      ],
      highlighted: true,
    },
    {
      name: "Business",
      subtitle: "For teams & companies",
      price: 25,
      yearlyPrice: 250,
      gradient: "from-teal-400 via-cyan-400 to-blue-500",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Role-based access",
        "Advanced analytics",
        "Dedicated account manager",
      ],
    },
  ];

  return (
    <div className= "  min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-14">
        <span className={`mr-3 font-medium ${!isYearly ? "text-gray-900" : "text-gray-500"}`}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
          />
          <div className="w-12 h-7 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600"></div>
          <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
        </label>
        <span className={`ml-3 font-medium ${isYearly ? "text-gray-900" : "text-gray-500"}`}>
          Yearly <span className="text-green-600 text-sm">(Save 20%)</span>
        </span>
      </div>

      {/* Cards */}
      <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-3xl p-8 shadow-xl border bg-white/70 backdrop-blur-md transition hover:shadow-2xl hover:-translate-y-1 duration-300
            ${plan.highlighted ? "border-indigo-600 scale-105" : "border-gray-200"}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="flex items-center gap-1 px-4 py-1 rounded-full bg-indigo-600 text-white text-sm font-medium shadow-md">
                  <Star size={16} /> Most Popular
                </span>
              </div>
            )}

            {/* Gradient Text for Plan Name */}
            <h3 className={`text-2xl font-bold mb-1 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
              {plan.name}
            </h3>
            <p className="text-gray-500">{plan.subtitle}</p>

            <p className="mt-6 text-5xl font-extrabold text-gray-900">
              ${isYearly ? plan.yearlyPrice : plan.price}
              <span className="text-lg font-medium text-gray-500">
                {isYearly ? "/yr" : "/mo"}
              </span>
            </p>

            <ul className="mt-8 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="text-green-500" size={20} />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`mt-10 w-full py-4 rounded-2xl font-semibold transition text-lg shadow-md
                ${plan.highlighted
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
            >
              {plan.price === 0 ? "Get Started" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Extra Section */}
      <div className="max-w-4xl mx-auto text-center mt-20">
        <p className="text-gray-600">
          Still not sure? <span className="font-semibold text-indigo-600">Try Pro free for 14 days</span>, no credit card required.
        </p>
      </div>
    </div>
  );
}
