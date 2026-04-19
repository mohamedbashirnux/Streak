"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  current: number;
  total: number;
  size?: number;
}

export default function ProgressRing({ current, total, size = 120 }: ProgressRingProps) {
  const percentage = (current / total) * 100;
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2937"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#22c55e"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{current}</span>
        <span className="text-sm text-gray-400">of {total}</span>
      </div>
    </div>
  );
}
