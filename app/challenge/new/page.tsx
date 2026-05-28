"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import ChallengeForm from "@/components/challenge/ChallengeForm";
import { Loader2, Layers, Target } from "lucide-react";

function NewChallengeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId") || undefined;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {groupId ? (
              <Layers className="text-purple-400" size={28} />
            ) : (
              <Target className="text-green-500" size={28} />
            )}
            <h1 className="text-3xl font-bold text-white">
              {groupId ? "Add Habit to Group" : "Create Habit"}
            </h1>
          </div>
          <p className="text-gray-400">
            {groupId
              ? "This habit will be added to your group. You can add more habits to the group later."
              : "Track one habit with daily check-ins and build your streak."}
          </p>
        </div>

        <div className="bg-[#111111] rounded-xl border border-gray-800 p-6 sm:p-8">
          <ChallengeForm groupId={groupId} />
        </div>
      </main>
    </div>
  );
}

export default function NewChallengePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    }>
      <NewChallengeContent />
    </Suspense>
  );
}
