"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CreditCard,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

export default function VerticalStepperGlass() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Account Setup",
      description: "Set up your account information to get started.",
      icon: <User size={20} />,
      color: "text-blue-400",
    },
    {
      id: 2,
      title: "Payment Details",
      description: "Add your preferred payment method securely.",
      icon: <CreditCard size={20} />,
      color: "text-yellow-400",
    },
    {
      id: 3,
      title: "Confirmation",
      description: "Review everything before finishing setup.",
      icon: <ClipboardCheck size={20} />,
      color: "text-green-400",
    },
  ];

  const nextStep = () => {
    if (activeStep < steps.length) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white p-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 transition-all duration-500">

        {/* 🧭 Stepper Side */}
        <div className="w-full md:w-1/3 space-y-10 relative">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Step Circle */}
              <div
                className={`p-3 rounded-full flex items-center justify-center transition-all duration-500 ${
                  step.id === activeStep
                    ? "bg-white/20 border-2 border-blue-400"
                    : step.id < activeStep
                    ? "bg-green-500"
                    : "bg-white/10 border border-gray-600"
                }`}
              >
                {step.id < activeStep ? (
                  <CheckCircle2 size={22} className="text-white" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Title + Description */}
              <div>
                <h3
                  className={`font-semibold text-lg ${
                    step.id === activeStep ? step.color : "text-gray-300"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1 max-w-[90%]">
                  {step.description}
                </p>
              </div>

              {/* Connecting Line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[18px] top-12 w-[2px] h-16 bg-gradient-to-b from-gray-700 to-gray-800" />
              )}
            </div>
          ))}
        </div>

        {/* 💡 Step Content (Glass Card) */}
        <div className="w-full md:w-2/3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-inner p-8 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              {activeStep === 1 && (
                <>
                  <User size={50} className="mx-auto text-blue-400" />
                  <h2 className="text-2xl font-bold">Account Setup</h2>
                  <p className="text-gray-400">
                    Let's begin by preparing your account. This will take only a few moments.
                  </p>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <CreditCard size={50} className="mx-auto text-yellow-400" />
                  <h2 className="text-2xl font-bold">Payment Details</h2>
                  <p className="text-gray-400">
                    Securely add your payment details to continue.
                  </p>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <ClipboardCheck size={50} className="mx-auto text-green-400" />
                  <h2 className="text-2xl font-bold">Confirmation</h2>
                  <p className="text-gray-400">
                    Review your information and confirm to complete the process.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 🔘 Navigation Buttons */}
          <div className="flex justify-between mt-10">
            <button
              onClick={prevStep}
              disabled={activeStep === 1}
              className={`px-6 py-2 rounded-lg transition ${
                activeStep === 1
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              Back
            </button>

            {activeStep < steps.length ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 rounded-lg bg-blue-500/80 hover:bg-blue-500 transition text-white shadow-lg shadow-blue-700/30"
              >
                Continue
              </button>
            ) : (
              <button className="px-6 py-2 rounded-lg bg-green-500/80 hover:bg-green-500 transition text-white shadow-lg shadow-green-700/30">
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
