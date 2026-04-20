"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative rounded-xl border p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto",
          className
        )}
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
            <button
              onClick={onClose}
              style={{ color: "var(--text-secondary)" }}
              className="hover:opacity-80 transition-opacity"
            >
              <X size={24} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
