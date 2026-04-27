"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CleanupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCleanup = async () => {
    if (!confirm("⚠️ WARNING: This will DELETE ALL DATA from your database!\n\nAre you absolutely sure?")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/cleanup", {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        toast.success("Database cleaned successfully!");
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        toast.error(data.error || "Failed to clean database");
        setResult({ error: data.error });
      }
    } catch (error) {
      toast.error("Something went wrong");
      setResult({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="text-red-500" size={40} />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Database Cleanup</h1>
            <p className="text-gray-400">
              Remove all data from your MongoDB database
            </p>
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={20} />
              <div className="text-left">
                <h3 className="text-red-500 font-bold mb-2">⚠️ Warning: Destructive Action</h3>
                <p className="text-gray-300 text-sm mb-2">
                  This will permanently delete:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>All user accounts</li>
                  <li>All challenges</li>
                  <li>All categories</li>
                  <li>All stats and progress</li>
                </ul>
                <p className="text-red-400 text-sm mt-3 font-semibold">
                  This action cannot be undone!
                </p>
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.error 
                ? "bg-red-500/10 border border-red-500/30" 
                : "bg-green-500/10 border border-green-500/30"
            }`}>
              <pre className="text-left text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCleanup}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Cleaning...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Clean Database
                </>
              )}
            </Button>
          </div>

          {result && !result.error && (
            <p className="text-sm text-gray-400">
              Redirecting to home page in 3 seconds...
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
