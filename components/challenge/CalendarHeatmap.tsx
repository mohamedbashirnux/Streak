"use client";

import { ChallengeDay } from "@/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

interface CalendarHeatmapProps {
  days: ChallengeDay[];
  startDate: Date;
}

export default function CalendarHeatmap({ days, startDate }: CalendarHeatmapProps) {
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

        {allDays.map((date) => (
          <div
            key={date.toISOString()}
            className={`aspect-square rounded ${getStatusColor(date)} flex items-center justify-center text-xs text-white font-medium hover:opacity-80 transition-opacity cursor-pointer`}
            title={format(date, "MMM d, yyyy")}
          >
            {format(date, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}
