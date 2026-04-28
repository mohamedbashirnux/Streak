"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { User } from "@/types";
import { 
  Loader2, 
  User as UserIcon, 
  Lock, 
  Camera, 
  Globe, 
  Palette, 
  Download, 
  Upload,
  Settings,
  Sun,
  Moon
} from "lucide-react";
import toast from "react-hot-toast";

const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    avatar: "", 
    timezone: "UTC", 
    theme: "dark" as "light" | "dark" 
  });
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });

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
        setFormData({ 
          name: data.name, 
          avatar: data.avatar || "", 
          timezone: data.timezone || "UTC",
          theme: data.theme || "dark"
        });
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max size is 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => prev ? { ...prev, avatar: data.avatar } : null);
        setFormData(prev => ({ ...prev, avatar: data.avatar }));
        toast.success("Avatar updated!");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to upload avatar");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUploadingAvatar(false);
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

  const handleExport = async (format: "json" | "csv") => {
    try {
      const res = await fetch(`/api/user/export?format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `neverbreak-export-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Data exported as ${format.toUpperCase()}!`);
      } else {
        toast.error("Failed to export data");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("importFile", file);

    try {
      const res = await fetch("/api/user/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchProfile(); // Refresh profile data
      } else {
        toast.error(data.error || "Failed to import data");
      }
    } catch {
      toast.error("Something went wrong");
    }

    // Reset file input
    if (importInputRef.current) {
      importInputRef.current.value = "";
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
  const selectClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-white">Profile & Settings</h1>

        {loading && !user ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-500" size={48} />
          </div>
        ) : (
          <>
            {/* Profile Info */}
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <UserIcon className="text-green-500" size={20} />
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="text-green-500" size={40} />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : (
                      <Camera size={12} />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Timezone: {user?.timezone || "UTC"} | Theme: {user?.theme || "dark"}
                  </p>
                </div>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      className={inputClass} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Globe className="inline mr-2" size={16} />
                      Timezone
                    </label>
                    <select 
                      value={formData.timezone} 
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })} 
                      className={selectClass}
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Palette className="inline mr-2" size={16} />
                      Theme
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={formData.theme === "dark"}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value as "light" | "dark" })}
                          className="text-green-500"
                        />
                        <Moon size={16} className="text-gray-400" />
                        <span className="text-white">Dark</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={formData.theme === "light"}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value as "light" | "dark" })}
                          className="text-green-500"
                        />
                        <Sun size={16} className="text-gray-400" />
                        <span className="text-white">Light</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={() => setEditing(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Settings className="mr-2" size={16} />
                  Edit Profile
                </Button>
              )}
            </Card>

            {/* Data Management */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Download className="text-green-500" size={20} />
                <h3 className="text-lg font-semibold text-white">Data Management</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Export Data</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Download your challenges, stats, and progress data
                  </p>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleExport("json")} className="flex-1">
                      Export JSON
                    </Button>
                    <Button variant="secondary" onClick={() => handleExport("csv")} className="flex-1">
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Import Data</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Import challenges from a previous export (JSON only)
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={() => importInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2" size={16} />
                    Import Data
                  </Button>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </div>
              </div>
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
                    <input 
                      type="password" 
                      value={passwordData.currentPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} 
                      className={inputClass} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.newPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
                      className={inputClass} 
                      required 
                      minLength={6} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordData.confirmPassword} 
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
                      className={inputClass} 
                      required 
                      minLength={6} 
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="secondary" onClick={() => setChangingPassword(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? "Saving..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              ) : (
                <Button variant="secondary" onClick={() => setChangingPassword(true)}>
                  Change Password
                </Button>
              )}
            </Card>

            {/* Danger Zone */}
            <Card>
              <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">
                Clear all your challenges, stats, and badges. Your account will remain but all progress will be lost.
              </p>
              <Button variant="danger" onClick={handleReset} disabled={loading}>
                Reset All Data
              </Button>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
