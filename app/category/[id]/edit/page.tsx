"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Plus, X, Target, Ban, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { CategoryHabit, Category } from "@/types";

const habitIcons = [
  "📈", "🙏", "💪", "🚫", "📚", "💰", "🧘", "🏃", "🎯", "⚡",
  "🔥", "💎", "🌟", "🏆", "⚔️", "🛡️", "🎨", "🎵", "📝", "💻"
];

export default function EditCategoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [habits, setHabits] = useState<CategoryHabit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New habit form
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    type: "build" as "build" | "avoid",
    icon: "🎯",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id && id) {
      fetchCategory();
    }
  }, [session, id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCategory(data);
        setHabits(data.habits || []);
      } else {
        toast.error("Category not found");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) {
      toast.error("Habit name is required");
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
    toast.success("Habit added");
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    toast.success("Habit removed");
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habits }),
      });

      if (res.ok) {
        toast.success("Habits updated!");
        router.push(`/category/${id}`);
        router.refresh(); // Force refresh to load new habits
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update category");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  if (!session || !category) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/category/${id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Category</h1>
            <p className="text-gray-400">{category.title}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Add New Habit */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-4">Add New Habit</h2>
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

          {/* Current Habits */}
          {habits.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Current Habits ({habits.length})</h2>
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

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push(`/category/${id}`)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : null}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
