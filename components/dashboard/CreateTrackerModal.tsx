"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Target } from "lucide-react";

interface CreateTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTrackerModal({ isOpen, onClose }: CreateTrackerModalProps) {
  const router = useRouter();

  const handleCreate = () => {
    onClose();
    router.push("/challenge/new");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Habit Tracker">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <Target className="text-green-500" size={40} />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Track Your Habit</h3>
          <p className="text-gray-400">
            Create a new habit tracker and start building your streak today!
          </p>
        </div>

        <Button
          onClick={handleCreate}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Create Habit Tracker
        </Button>
      </div>
    </Modal>
  );
}
