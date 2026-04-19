"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { User } from "@/types";
import { Loader2, User as UserIcon, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", avatar: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({ name: data.name, avatar: data.avatar || "" });
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setEditing(false);
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed!");
        setChangingPassword(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("⚠️ Are you sure? This will delete ALL your challenges, stats, and badges. This cannot be undone!")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/reset", { method: "POST" });
      if (res.ok) {
        toast.success("All data cleared! Starting fresh 🔥");
        router.push("/dashboard");
      } else {
        toast.error("Failed to reset data");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-500" size={48} />
      </div>
    );
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>

        {loading && !user ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : (
          <>
            {/* Profile Info */}
            <Card>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserIcon className="text-green-500" size={40} />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
                    <input type="url" value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} className={inputClass} placeholder="https://example.com/avatar.jpg" />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
                    <Button type="submit" disabled={loading} className="flex-1">{loading ? "Saving..." : "Save Changes"}</Button>
                  </div>
                </form>
              ) : (
                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
              )}
            </Card>

            {/* Change Password */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="text-green-500" size={20} />
                <h3 className="text-lg font-semibold text-white">Change Password</h3>
              </div>

              {changingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className={inputClass} required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className={inputClass} required minLength={6} />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={() => setChangingPassword(false)} className="flex-1">Cancel</Button>
                    <Button type="submit" disabled={loading} className="flex-1">{loading ? "Saving..." : "Update Password"}</Button>
                  </div>
                </form>
              ) : (
                <Button variant="secondary" onClick={() => setChangingPassword(true)}>Change Password</Button>
              )}
            </Card>

            {/* Danger Zone */}
            <Card>
              <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">
                Clear all your challenges, stats, and badges. Your account will remain but all progress will be lost.
              </p>
              <Button variant="danger" onClick={handleReset} disabled={loading}>Reset All Data</Button>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
