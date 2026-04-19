import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeverBreak - Streak-Based Habit Tracker",
  description: "Build discipline through unbreakable streaks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white" suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111111",
                color: "#fff",
                border: "1px solid #374151",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
