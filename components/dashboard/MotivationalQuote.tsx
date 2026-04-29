"use client";

import { useEffect, useState } from "react";
import { getRandomQuote } from "@/lib/client-utils";
import { Quote } from "lucide-react";

export default function MotivationalQuote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <Quote className="text-green-500 flex-shrink-0" size={24} />
        <p className="text-lg text-gray-200 italic">{quote}</p>
      </div>
    </div>
  );
}
