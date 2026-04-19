"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Challenge } from "@/types";
import { CheckCircle, XCircle, Loader2, RotateCcw, Filter } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type FilterType = "all" | "completed" | "failed";
type SortType = "newest" | "oldest" | "longest" | "shortest";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) fetchHistory();
  }, [session]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/challenges");
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.filter((c: Challenge) => c.status === "completed" || c.status === "failed"));
      }
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async (challengeId: string) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/restart`, { method: "POST" });
      if (res.ok) {
        toast.success("Challenge restarted!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to restart challenge");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const filtered = challenges
    .filter((c) => filter === "all" || c.status === filter)
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "longest") return b.duration - a.duration;
      if (sort === "shortest") return a.duration - b.duration;
      return 0;
    });

  const completedCount = challenges.filter((c) => c.status === "completed").length;
  const failedCount = challenges.filter((c) => c.status === "failed").length;

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Challenge History</h1>
        <p className="text-gray-400 mb-6">
          {completedCount} completed · {failedCount} failed · {challenges.length} total
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2">
            {(["all", "completed", "failed"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  filter === f
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="ml-auto bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-green-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="longest">Longest duration</option>
            <option value="shortest">Shortest duration</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No challenges found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((challenge) => (
              <Card key={challenge._id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      challenge.status === "completed" ? "bg-green-500/10" : "bg-red-500/10"
                    }`}>
                      {challenge.status === "completed"
                        ? <CheckCircle className="text-green-500" size={24} />
                        : <XCircle className="text-red-500" size={24} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-1">{challenge.name}</h3>
                      <p className="text-sm text-gray-400 mb-2 capitalize">
                        {challenge.type} habit · {challenge.duration} days
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="text-gray-400">
                          Started: {format(new Date(challenge.startDate), "MMM d, yyyy")}
                        </span>
                        {challenge.completedAt && (
                          <span className="text-gray-400">
                            Ended: {format(new Date(challenge.completedAt), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className={challenge.status === "completed" ? "text-green-500" : "text-red-500"}>
                          {challenge.status === "completed"
                            ? `✅ Completed (${challenge.currentStreak}/${challenge.duration} days)`
                            : `❌ Failed on day ${challenge.currentStreak}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  {challenge.status === "failed" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRestart(challenge._id)}
                      className="flex items-center gap-2 flex-shrink-0 ml-4"
                    >
                      <RotateCcw size={16} />
                      Restart
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
