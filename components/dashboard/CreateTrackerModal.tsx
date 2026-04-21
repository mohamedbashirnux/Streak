"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import { Target, Folder, ArrowRight } from "lucide-react";

interface CreateTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTrackerModal({ isOpen, onClose }: CreateTrackerModalProps) {
  const router = useRouter();

  const handleChoice = (type: "single" | "category") => {
    onClose();
    if (type === "single") {
      router.push("/challenge/new");
    } else {
      router.push("/category/new");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Habit Tracker">
      <div className="space-y-4">
        <p className="text-gray-400 text-center mb-6">
          Choose how you want to track your habits
        </p>

        {/* Single Habit Option */}
        <Card
          className="cursor-pointer transition-all hover:scale-105 hover:border-green-500/50 group"
          onClick={() => handleChoice("single")}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
              <Target className="text-green-500" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Single Habit</h3>
              <p className="text-sm text-gray-400">
                Track one habit at a time. Perfect for focused goals.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>✓ Simple tracking</span>
                <span>•</span>
                <span>✓ One daily check-in</span>
              </div>
            </div>
            <ArrowRight className="text-gray-600 group-hover:text-green-500 transition-colors" size={24} />
          </div>
        </Card>

        {/* Multiple Habits (Category) Option */}
        <Card
          className="cursor-pointer transition-all hover:scale-105 hover:border-purple-500/50 group"
          onClick={() => handleChoice("category")}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Folder className="text-purple-500" size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Multiple Habits</h3>
              <p className="text-sm text-gray-400">
                Group connected habits together. Win the day by completing all.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>✓ Up to 6 habits</span>
                <span>•</span>
                <span>✓ All-or-nothing tracking</span>
              </div>
            </div>
            <ArrowRight className="text-gray-600 group-hover:text-purple-500 transition-colors" size={24} />
          </div>
        </Card>
      </div>
    </Modal>
  );
}
