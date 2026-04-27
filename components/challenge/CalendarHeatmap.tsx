"use client";

import { useState } from "react";
import { ChallengeDay } from "@/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Calendar, Save } from "lucide-react";

interface CalendarHeatmapProps {
  days: ChallengeDay[];
  startDate: Date;
  challengeId?: string;
  onSaveNote?: (date: Date, note: string) => Promise<void>;
}

export default function CalendarHeatmap({ days, startDate, challengeId, onSaveNote }: CalendarHeatmapProps) {
  const [selectedDay, setSelectedDay] = useState<ChallengeDay | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const start = new Date(startDate);
  const end = new Date(days[days.length - 1]?.date || start);

  const allDays = eachDayOfInterval({ start, end });

  const getStatusColor = (date: Date) => {
    const day = days.find((d) => isSameDay(new Date(d.date), date));
    if (!day) return "bg-gray-800";

    switch (day.status) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "missed":
        return "bg-gray-600";
      case "pending":
        return "bg-gray-700";
      default:
        return "bg-gray-800";
    }
  };

  const handleDayClick = (date: Date) => {
    const day = days.find((d) => isSameDay(new Date(d.date), date));
    if (day) {
      setSelectedDay(day);
      setNote(day.notes || "");
      setIsModalOpen(true);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedDay || !onSaveNote) return;

    setSaving(true);
    try {
      await onSaveNote(new Date(selectedDay.date), note);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setSaving(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success": return "✅ Completed";
      case "failed": return "❌ Failed";
      case "missed": return "⏭️ Missed";
      case "pending": return "⏳ Pending";
      default: return "Unknown";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-400">Success</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-400">Failed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
          <span className="text-gray-400">Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium">
            {day}
          </div>
        ))}
        
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {allDays.map((date) => {
          const day = days.find((d) => isSameDay(new Date(d.date), date));
          const hasNote = day?.notes && day.notes.length > 0;
          
          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDayClick(date)}
              className={`aspect-square rounded ${getStatusColor(date)} flex items-center justify-center text-xs text-white font-medium hover:opacity-80 hover:scale-110 transition-all cursor-pointer relative`}
              title={format(date, "MMM d, yyyy")}
            >
              {format(date, "d")}
              {hasNote && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-gray-900" />
              )}
            </div>
          );
        })}
      </div>

      {/* Day Details Modal */}
      {selectedDay && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Day Details">
          <div className="space-y-4">
            {/* Date and Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="text-green-500" size={20} />
                <span className="text-white font-semibold">
                  {format(new Date(selectedDay.date), "MMMM d, yyyy")}
                </span>
              </div>
              <span className="text-sm">
                {getStatusLabel(selectedDay.status)}
              </span>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Notes for this day
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes about this day... (e.g., how you felt, challenges, wins)"
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>

            {/* Save Button */}
            {onSaveNote && (
              <Button
                onClick={handleSaveNote}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save size={16} />
                    Save Note
                  </>
                )}
              </Button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
