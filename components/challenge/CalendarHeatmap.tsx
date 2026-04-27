"use client";

import { useState } from "react";
import { ChallengeDay } from "@/types";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
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
  const [selectedMood, setSelectedMood] = useState<string>("");

  const moods = [
    { emoji: "😊", label: "Great" },
    { emoji: "🙂", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Tough" },
    { emoji: "😫", label: "Hard" },
  ];

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
      // Check if day is in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const clickedDate = new Date(date);
      clickedDate.setHours(0, 0, 0, 0);
      
      if (clickedDate > today) {
        // Don't allow notes for future days
        return;
      }
      
      setSelectedDay(day);
      setNote(day.notes || "");
      
      // Extract mood from existing note if present
      const moodMatch = day.notes?.match(/^(😊|🙂|😐|😔|😫)/);
      setSelectedMood(moodMatch ? moodMatch[1] : "");
      
      setIsModalOpen(true);
    }
  };

  const handleMoodSelect = (emoji: string) => {
    setSelectedMood(emoji);
    // Add mood to beginning of note if not already there
    if (!note.startsWith(emoji)) {
      const cleanNote = note.replace(/^(😊|🙂|😐|😔|😫)\s*/, "");
      setNote(emoji + (cleanNote ? " " + cleanNote : ""));
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
          
          // Check if day is in the future
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dayDate = new Date(date);
          dayDate.setHours(0, 0, 0, 0);
          const isFuture = dayDate > today;
          
          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDayClick(date)}
              className={`aspect-square rounded ${getStatusColor(date)} flex items-center justify-center text-xs text-white font-medium transition-all relative ${
                isFuture 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:opacity-80 hover:scale-110 cursor-pointer"
              }`}
              title={isFuture ? "Future day" : format(date, "MMM d, yyyy")}
            >
              {format(date, "d")}
              {hasNote && !isFuture && (
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

            {/* How did you feel? */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                How did you feel today?
              </label>
              <div className="flex gap-2 justify-center">
                {moods.map((mood) => (
                  <button
                    key={mood.emoji}
                    onClick={() => handleMoodSelect(mood.emoji)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                      selectedMood === mood.emoji
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs text-gray-400">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Notes for this day
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes... (e.g., challenges, wins, thoughts)"
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
