import Link from "next/link";
import { Flame, Target, Award } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      <nav className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Flame className="text-green-500" size={28} />
              <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>NeverBreak</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              Build Discipline Through
              <span className="text-green-500"> Unbreakable Streaks</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              NeverBreak is a challenge-based habit tracker that helps you build or break habits
              through the power of streaks. One miss = restart from Day 1.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Your First Challenge
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 px-4" style={{ backgroundColor: "var(--bg-surface)" }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "var(--text-primary)" }}>
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>1. Create Challenge</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Choose a habit to build or break. Set your duration: 21, 30, 60, or 90 days.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>2. Check In Daily</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Mark your progress every day. Build your streak one day at a time.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>3. Earn Badges</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Complete milestones and challenges to unlock achievement badges.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
              The Power of "Don't Break the Chain"
            </h2>
            <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
              One missed day resets your streak to Day 1. This psychological pressure creates
              real accountability and builds genuine discipline. No excuses, no shortcuts.
            </p>
            <Link href="/signup">
              <Button size="lg">Join NeverBreak Today</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center" style={{ color: "var(--text-secondary)" }}>
          <p>&copy; 2026 NeverBreak. Build discipline, one day at a time.</p>
        </div>
      </footer>
    </div>
  );
}
