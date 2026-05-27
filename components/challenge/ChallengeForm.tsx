"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Target, Ban, Calendar, Map, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Journey } from "@/types";

const JOURNEY_COLORS = [
  "#22c55e", // green
  "#3b82f6", // blue
  "#a855f7", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
];

export default function ChallengeForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [showNewJourney, setShowNewJourney] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "avoid" as "avoid" | "build",
    duration: 30,
    motivation: "",
    startDate: new Date().toISOString().split("T")[0],
    journeyId: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newJourney, setNewJourney] = useState({
    name: "",
    description: "",
    color: "#22c55e",
    duration: 90,
  });

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    try {
      const res = await fetch("/api/journeys");
      if (res.ok) {
        const data = await res.json();
        setJourneys(data);
      }
    } catch {
      // silently fail
    }
  };

  const handleCreateJourney = async () => {
    if (!newJourney.name) {
      toast.error("Journey name is required");
      return;
    }
    try {
      const res = await fetch("/api/journeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newJourney, startDate: formData.startDate }),
      });
      if (res.ok) {
        const created = await res.json();
        setJourneys(prev => [created, ...prev]);
        setFormData(prev => ({ ...prev, journeyId: created._id }));
        setShowNewJourney(false);
        setNewJourney({ name: "", description: "", color: "#22c55e", duration: 90 });
        toast.success("Journey created!");
      }
    } catch {
      toast.error("Failed to create journey");
    }
  };

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
        toast.success("Habit created!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create habit");
      }
    } catch {
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
    { value: 365, label: "1 Year" },
  ];

  const selectedJourney = journeys.find(j => j._id === formData.journeyId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Journey Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Map className="inline mr-2" size={16} />
          Journey (optional)
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Group this habit under a journey — e.g. "Transform My Life in 90 Days"
        </p>

        {/* Journey list */}
        <div className="space-y-2 mb-3">
          {/* No journey option */}
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, journeyId: "" }))}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
              !formData.journeyId
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
          >
            <div className="w-4 h-4 rounded-full border-2 border-gray-500 flex-shrink-0" />
            <span className="text-gray-300 text-sm">No journey — standalone habit</span>
          </button>

          {journeys.map(journey => (
            <button
              key={journey._id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, journeyId: journey._id }))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                formData.journeyId === journey._id
                  ? "border-opacity-100 bg-opacity-10"
                  : "border-gray-700 bg-gray-800 hover:border-gray-600"
              }`}
              style={
                formData.journeyId === journey._id
                  ? { borderColor: journey.color, backgroundColor: journey.color + "15" }
                  : {}
              }
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: journey.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{journey.name}</p>
                {journey.description && (
                  <p className="text-gray-400 text-xs truncate">{journey.description}</p>
                )}
              </div>
              <span className="text-gray-500 text-xs flex-shrink-0">{journey.duration}d</span>
            </button>
          ))}
        </div>

        {/* Create new journey inline */}
        {showNewJourney ? (
          <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-white">New Journey</p>
              <button type="button" onClick={() => setShowNewJourney(false)}>
                <X className="text-gray-400 hover:text-white" size={16} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Journey name *"
              value={newJourney.name}
              onChange={e => setNewJourney(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newJourney.description}
              onChange={e => setNewJourney(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
            <div>
              <p className="text-xs text-gray-400 mb-2">Duration</p>
              <div className="flex gap-2 flex-wrap">
                {[30, 60, 90, 180, 365].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setNewJourney(prev => ({ ...prev, duration: d }))}
                    className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
                      newJourney.duration === d
                        ? "border-green-500 bg-green-500/10 text-white"
                        : "border-gray-600 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {d === 365 ? "1 Year" : `${d}d`}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {JOURNEY_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewJourney(prev => ({ ...prev, color }))}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      newJourney.color === color ? "border-white scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <Button type="button" onClick={handleCreateJourney} className="w-full" size="sm">
              Create Journey
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNewJourney(true)}
            className="flex items-center gap-2 text-sm text-green-500 hover:text-green-400 transition-colors"
          >
            <Plus size={16} />
            Create new journey
          </button>
        )}
      </div>

      {/* Habit Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Habit Name *
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

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Habit Type *
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

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Duration *</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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

      {/* Custom Duration */}
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

      {/* Motivation */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Motivation (optional)
        </label>
        <textarea
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500 resize-none"
          rows={3}
          placeholder="Why are you doing this?"
        />
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
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
            wrapperClassName="w-full"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creating..." : "Create Habit"}
        </Button>
      </div>
    </form>
  );
}
