"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-green-500 to-green-400"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
