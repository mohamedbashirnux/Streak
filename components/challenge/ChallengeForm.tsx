"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Target, Ban, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ChallengeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "avoid" as "avoid" | "build",
    duration: 30,
    motivation: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Challenge created!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create challenge");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const durationOptions = [
    { value: 21, label: "21 Days" },
    { value: 30, label: "30 Days" },
    { value: 60, label: "60 Days" },
    { value: 90, label: "90 Days" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Challenge Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
          placeholder="e.g., No Junk Food, Wake Up Early"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Challenge Type *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "avoid" })}
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.type === "avoid"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
          >
            <Ban className="mx-auto mb-2 text-green-500" size={32} />
            <p className="font-medium text-white">Avoid Habit</p>
            <p className="text-sm text-gray-400 mt-1">Stop doing something</p>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "build" })}
            className={`p-4 rounded-lg border-2 transition-all ${
              formData.type === "build"
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
          >
            <Target className="mx-auto mb-2 text-green-500" size={32} />
            <p className="font-medium text-white">Build Habit</p>
            <p className="text-sm text-gray-400 mt-1">Do something daily</p>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Duration *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, duration: option.value })}
              className={`py-3 rounded-lg border-2 font-medium transition-all ${
                formData.duration === option.value
                  ? "border-green-500 bg-green-500/10 text-white"
                  : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Custom Duration (days)
        </label>
        <input
          type="number"
          min="1"
          max="365"
          value={formData.duration || ""}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Motivation (optional)
        </label>
        <textarea
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 resize-none"
          rows={3}
          placeholder="Why are you doing this challenge?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Start Date
        </label>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date) {
                setSelectedDate(date);
                setFormData({ ...formData, startDate: date.toISOString().split("T")[0] });
              }
            }}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            calendarClassName="dark-calendar"
            wrapperClassName="w-full"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creating..." : "Create Challenge"}
        </Button>
      </div>
    </form>
  );
}
