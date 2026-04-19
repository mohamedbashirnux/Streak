"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface CheckInButtonProps {
  challengeId: string;
  onCheckIn: (success: boolean) => Promise<void>;
  disabled?: boolean;
}

export default function CheckInButton({ challengeId, onCheckIn, disabled }: CheckInButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (success: boolean) => {
    setLoading(true);
    try {
      await onCheckIn(success);
      setShowModal(false);
    } catch (error) {
      console.error("Check-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => setShowModal(true)}
          disabled={disabled || loading}
          className="w-full"
        >
          Check In Today
        </Button>
      </motion.div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Daily Check-In">
        <p className="text-gray-300 mb-6">Did you complete your challenge today?</p>
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={() => handleCheckIn(true)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Yes, I did it!
          </Button>
          <Button
            variant="danger"
            onClick={() => handleCheckIn(false)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <X size={20} />
            I failed
          </Button>
        </div>
      </Modal>
    </>
  );
}
