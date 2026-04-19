import { create } from "zustand";
import { Challenge } from "@/types";

interface ChallengeStore {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  setChallenges: (challenges: Challenge[]) => void;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  removeChallenge: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChallengeStore = create<ChallengeStore>((set) => ({
  challenges: [],
  loading: false,
  error: null,
  setChallenges: (challenges) => set({ challenges }),
  addChallenge: (challenge) =>
    set((state) => ({ challenges: [challenge, ...state.challenges] })),
  updateChallenge: (id, updates) =>
    set((state) => ({
      challenges: state.challenges.map((c) =>
        c._id === id ? { ...c, ...updates } : c
      ),
    })),
  removeChallenge: (id) =>
    set((state) => ({
      challenges: state.challenges.filter((c) => c._id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
