"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TextRevealCardPreview() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] h-[40rem] w-full p-4">
      <RevealCard
        mainText="You know the business"
        revealText="I know the chemistry"
        title="Sometimes, you just need to see it."
        description="This is a text reveal card. Hover over the card to reveal the hidden text."
      />
    </div>
  );
}

function RevealCard({ mainText, revealText, title, description }) {
  return (
    <motion.div
      className="relative bg-[#1C1C1E] rounded-2xl p-8 w-full max-w-md cursor-pointer shadow-xl overflow-hidden"
      initial="rest"
      whileHover="hover"
    >
      {/* Main text */}
      <motion.div
        className="text-white text-2xl font-bold"
        variants={{
          rest: { opacity: 1, y: 0 },
          hover: { opacity: 0.3, y: -20 },
        }}
        transition={{ duration: 0.5 }}
      >
        {mainText}
      </motion.div>

      {/* Revealed text */}
      <motion.div
        className="absolute top-8 left-8 text-white text-2xl font-bold"
        variants={{
          rest: { opacity: 0, y: 20 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5 }}
      >
        {revealText}
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-white text-lg font-semibold mt-8"
        variants={{
          rest: { opacity: 0.7 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-white/70 mt-2 text-sm"
        variants={{
          rest: { opacity: 0.5 },
          hover: { opacity: 0.9 },
        }}
        transition={{ duration: 0.5 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
