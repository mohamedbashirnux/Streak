"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "History" },
    { href: "/stats", label: "Stats" },
    { href: "/profile", label: "Profile" },
  ];

  if (!session) return null;

  return (
    <nav className="sticky top-0 z-40 border-b" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Flame className="text-green-500" size={28} />
            <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>NeverBreak</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-green-500" : ""
                }`}
                style={pathname !== link.href ? { color: "var(--text-secondary)" } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: "var(--text-secondary)" }}>
              {session.user?.name}
            </span>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
              style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)" }}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden md:flex items-center gap-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden transition-colors hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-green-500 bg-green-500/10" : ""
                }`}
                style={pathname !== link.href ? { color: "var(--text-secondary)" } : {}}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-80"
              style={{ color: "var(--text-secondary)" }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
