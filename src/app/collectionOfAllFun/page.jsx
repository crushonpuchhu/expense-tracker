"use client";

import Link from "next/link";
import { ShieldCheck, Wallet, Calculator, Map,StepForward ,IndianRupee } from "lucide-react";

export default function ToolsPage() {
  const tools = [
    {
      name: "Password Checker",
      desc: "Check and generate secure passwords instantly.",
      icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />,
      link: "/passwordgenerater",
    },
    {
      name: "Balance Check",
      desc: "Check your UPI balance with secure PIN access.",
      icon: <Wallet className="w-10 h-10 text-green-500" />,
      link: "/balanceCheck",
    },
    {
      name: "Calculator",
      desc: " Calculator your expression ",
      icon: < Calculator className="w-10 h-10 text-blue-500" />,
      link: "/calculator",
    },
    {
      name: "Steper component",
      desc: "Modern Steper UI with smooth flow.",
      icon: <StepForward  className="w-10 h-10 text-pink-500" />,
      link: "/steperr",
    },
    {
      name: "Pricing component",
      desc: "Explore interactive pricing UI.",
      icon: <IndianRupee className="w-10 h-10 text-yellow-500" />,
      link: "/Pricing",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        ⚡ Premium UI Tools Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {tools.map((tool, index) => (
          <Link
            key={index}
            href={tool.link}
            className="group relative p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-indigo-300 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 transition">
                {tool.icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {tool.name}
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{tool.desc}</p>
            <div className="absolute bottom-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition">
              →
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-16 text-gray-500 text-sm">
        Crafted with ❤️ using Next.js & TailwindCSS
      </footer>
    </div>
  );
}
