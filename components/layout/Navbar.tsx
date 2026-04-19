"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, LogOut, User } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "History" },
    { href: "/stats", label: "Stats" },
    { href: "/profile", label: "Profile" },
  ];

  if (!session) return null;

  return (
    <nav className="bg-[#111111] border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Flame className="text-green-500" size={28} />
            <span className="text-xl font-bold text-white">NeverBreak</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-green-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              {session.user?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
