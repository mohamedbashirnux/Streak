"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Challenge } from "@/types";
import { CheckCircle, XCircle, Loader2, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/challenges");
      if (res.ok) {
        const data = await res.json();
        const pastChallenges = data.filter(
          (c: Challenge) => c.status === "completed" || c.status === "failed"
        );
        setChallenges(pastChallenges);
      }
    } catch (error) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async (challengeId: string) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}/restart`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Challenge restarted!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to restart challenge");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

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
        <h1 className="text-3xl font-bold text-white mb-8">Challenge History</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No completed or failed challenges yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge._id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        challenge.status === "completed"
                          ? "bg-green-500/10"
                          : "bg-red-500/10"
                      }`}
                    >
                      {challenge.status === "completed" ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : (
                        <XCircle className="text-red-500" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {challenge.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2 capitalize">
                        {challenge.type} habit • {challenge.duration} days
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-400">
                          Started: {format(new Date(challenge.startDate), "MMM d, yyyy")}
                        </span>
                        {challenge.completedAt && (
                          <span className="text-gray-400">
                            Ended: {format(new Date(challenge.completedAt), "MMM d, yyyy")}
                          </span>
                        )}
                        <span
                          className={
                            challenge.status === "completed"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {challenge.status === "completed"
                            ? `✅ Completed (${challenge.currentStreak}/${challenge.duration} days)`
                            : `❌ Failed (${challenge.currentStreak}/${challenge.duration} days)`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {challenge.status === "failed" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRestart(challenge._id)}
                      className="flex items-center gap-2"
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
