"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, X, Target, Ban, Folder } from "lucide-react";
import toast from "react-hot-toast";
import { CategoryHabit } from "@/types";

const habitIcons = [
  "📈", "🙏", "💪", "🚫", "📚", "💰", "🧘", "🏃", "🎯", "⚡",
  "🔥", "💎", "🌟", "🏆", "⚔️", "🛡️", "🎨", "🎵", "📝", "💻"
];

export default function NewCategoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(365); // Default 1 year
  const [customDuration, setCustomDuration] = useState("");
  const [habits, setHabits] = useState<CategoryHabit[]>([]);
  const [loading, setLoading] = useState(false);

  // New habit form
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    type: "build" as "build" | "avoid",
    icon: "🎯",
  });

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const addHabit = () => {
    if (!newHabit.name.trim()) {
      toast.error("Habit name is required");
      return;
    }

    if (habits.length >= 6) {
      toast.error("Maximum 6 habits per Category");
      return;
    }

    const habit: CategoryHabit = {
      id: Date.now().toString(),
      name: newHabit.name.trim(),
      description: newHabit.description.trim(),
      type: newHabit.type,
      icon: newHabit.icon,
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: "", description: "", type: "build", icon: "🎯" });
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const createCategory = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const finalDuration = duration === 0 ? parseInt(customDuration) : duration;

    if (!finalDuration || finalDuration < 7) {
      toast.error("Minimum duration is 7 days");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          duration: finalDuration,
          habits,
        }),
      });

      if (res.ok) {
        toast.success("Category created! Add habits to start your transformation 🔥");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create Category");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Category</h1>
          <p className="text-gray-400">Group connected habits to transform your life (habits can be added later)</p>
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Category Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My 2026 Transformation"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Become the person I want to be..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration *
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={21}>21 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={60}>60 Days</option>
                  <option value={90}>90 Days</option>
                  <option value={180}>6 Months</option>
                  <option value={365}>1 Year</option>
                  <option value={0}>Custom</option>
                </select>
                
                {duration === 0 && (
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="Enter custom days"
                    min="7"
                    max="1000"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 mt-2"
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Add Habit */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Add Habits (Optional)</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Habit Name *
                  </label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="Watch forex & learn daily"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    value={newHabit.type}
                    onChange={(e) => setNewHabit({ ...newHabit, type: e.target.value as "build" | "avoid" })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="build">Build (Do Something)</option>
                    <option value="avoid">Avoid (Stop Something)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Watch 1 video, do backtesting, or learn something new"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {habitIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewHabit({ ...newHabit, icon })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                        newHabit.icon === icon
                          ? "bg-purple-500/20 border-2 border-purple-500"
                          : "bg-gray-800 border border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={addHabit} className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600">
                <Plus size={16} />
                Add Habit
              </Button>
            </div>
          </Card>

          {/* Habits List */}
          {habits.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Your Habits ({habits.length}/6)</h2>
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                    <div className="text-2xl">{habit.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{habit.name}</h3>
                        {habit.type === "build" ? (
                          <Target className="text-green-500" size={16} />
                        ) : (
                          <Ban className="text-red-500" size={16} />
                        )}
                      </div>
                      {habit.description && (
                        <p className="text-sm text-gray-400">{habit.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeHabit(habit.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Create Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              onClick={createCategory}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
            >
              <Folder size={16} />
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}