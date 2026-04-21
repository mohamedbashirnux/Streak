"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import ChallengeForm from "@/components/challenge/ChallengeForm";
import { Loader2 } from "lucide-react";

export default function NewChallengePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Single Habit Tracker</h1>
          <p className="text-gray-400">
            Track one habit at a time with focused daily check-ins
          </p>
        </div>

        <div className="bg-[#111111] rounded-xl border border-gray-800 p-6 sm:p-8">
          <ChallengeForm />
        </div>
      </main>
    </div>
  );
}
