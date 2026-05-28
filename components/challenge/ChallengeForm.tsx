"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Target, Ban, Calendar, Layers, Plus, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Journey } from "@/types";

const GROUP_COLORS = [
  "#22c55e", "#3b82f6", "#a855f7", "#f59e0b",
  "#ef4444", "#06b6d4", "#f97316", "#ec4899",
];

interface ChallengeFormProps {
  groupId?: string;
}

export default function ChallengeForm({ groupId: initialGroupId }: ChallengeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Journey[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);

  // "solo" | "existing" | "new"
  const [groupMode, setGroupMode] = useState<"solo" | "existing" | "new">(
    initialGroupId ? "existing" : "solo"
  );
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId || "");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    color: "#22c55e",
    duration: 90,
  });

  const [formData, setFormData] = useState({
    name: "",
    type: "avoid" as "avoid" | "build",
    duration: 30,
    motivation: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/journeys");
      if (res.ok) setGroups(await res.json());
    } catch {}
    finally { setGroupsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let resolvedGroupId: string | null = null;

      // If user wants a new group, create it first
      if (groupMode === "new") {
        if (!newGroup.name.trim()) {
          toast.error("Group name is required");
          setLoading(false);
          return;
        }
        const gRes = await fetch("/api/journeys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newGroup,
            startDate: formData.startDate,
          }),
        });
        if (!gRes.ok) {
          toast.error("Failed to create group");
          setLoading(false);
          return;
        }
        const created = await gRes.json();
        resolvedGroupId = created._id;
      } else if (groupMode === "existing" && selectedGroupId) {
        resolvedGroupId = selectedGroupId;
      }

      // Create the habit
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, journeyId: resolvedGroupId }),
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

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Habit Name ── */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Habit Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputClass}
          placeholder="e.g., No Junk Food, Wake Up Early"
          required
        />
      </div>

      {/* ── Habit Type ── */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Habit Type *</label>
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

      {/* ── Duration ── */}
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
        <input
          type="number"
          min="1"
          max="365"
          value={formData.duration || ""}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
          className={`${inputClass} mt-3`}
          placeholder="Or type a custom number of days"
        />
      </div>

      {/* ── Motivation ── */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Motivation (optional)</label>
        <textarea
          value={formData.motivation}
          onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Why are you doing this?"
        />
      </div>

      {/* ── Start Date ── */}
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
            className={inputClass}
            wrapperClassName="w-full"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
      </div>

      {/* ── Group Section ── */}
      <div className="border border-gray-700 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="text-purple-400" size={18} />
          <p className="text-white font-medium">Add to a group?</p>
        </div>

        {/* Toggle: Solo / Add to group */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGroupMode("solo")}
            className={`py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
              groupMode === "solo"
                ? "border-green-500 bg-green-500/10 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            Solo habit
          </button>
          <button
            type="button"
            onClick={() => {
              setGroupMode(groups.length > 0 ? "existing" : "new");
            }}
            className={`py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
              groupMode !== "solo"
                ? "border-purple-500 bg-purple-500/10 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            Add to group
          </button>
        </div>

        {/* Group picker — only shown when "Add to group" is selected */}
        {groupMode !== "solo" && (
          <div className="space-y-3">

            {/* Existing groups */}
            {!groupsLoading && groups.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Your groups</p>
                {groups.map(g => (
                  <button
                    key={g._id}
                    type="button"
                    onClick={() => {
                      setSelectedGroupId(g._id);
                      setGroupMode("existing");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                      groupMode === "existing" && selectedGroupId === g._id
                        ? "border-white/30 bg-white/5"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    style={
                      groupMode === "existing" && selectedGroupId === g._id
                        ? { borderColor: g.color + "80", backgroundColor: g.color + "15" }
                        : {}
                    }
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: g.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{g.name}</p>
                      {g.description && (
                        <p className="text-gray-400 text-xs truncate">{g.description}</p>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0">
                      {g.duration === 365 ? "1 Year" : `${g.duration}d`}
                    </span>
                    {groupMode === "existing" && selectedGroupId === g._id && (
                      <Check className="text-green-500 flex-shrink-0" size={16} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Create new group toggle */}
            {groupMode !== "new" ? (
              <button
                type="button"
                onClick={() => setGroupMode("new")}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus size={15} />
                Create a new group
              </button>
            ) : (
              <div className="space-y-3 p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">New Group</p>
                  {groups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setGroupMode("existing");
                        setSelectedGroupId(groups[0]._id);
                      }}
                    >
                      <X className="text-gray-400 hover:text-white" size={16} />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Group name *"
                  value={newGroup.name}
                  onChange={e => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                />

                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newGroup.description}
                  onChange={e => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                />

                <div>
                  <p className="text-xs text-gray-400 mb-2">Group Duration</p>
                  <div className="flex gap-2 flex-wrap">
                    {[30, 60, 90, 180, 365].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setNewGroup(prev => ({ ...prev, duration: d }))}
                        className={`px-3 py-1.5 rounded text-xs font-medium border transition-all ${
                          newGroup.duration === d
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
                    {GROUP_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewGroup(prev => ({ ...prev, color }))}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          newGroup.color === color ? "border-white scale-110" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {newGroup.name && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: newGroup.color + "50", backgroundColor: newGroup.color + "12" }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: newGroup.color }} />
                    <span className="text-white font-medium">{newGroup.name}</span>
                    <span className="text-gray-400 text-xs ml-auto">
                      {newGroup.duration === 365 ? "1 Year" : `${newGroup.duration}d`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Submit ── */}
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
