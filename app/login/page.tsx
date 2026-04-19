import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Flame } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Flame className="text-green-500" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue your streak</p>
        </div>

        <div className="bg-[#111111] rounded-xl border border-gray-800 p-8">
          <LoginForm />
        </div>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-500 hover:text-green-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
