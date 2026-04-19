# 🔥 NeverBreak - Streak-Based Habit Tracker

Build discipline through unbreakable streaks. One miss = restart from Day 1.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 What is NeverBreak?

NeverBreak is a challenge-based habit tracker that helps you build or break habits through the power of streaks. The core mechanic is simple but powerful: **one missed day resets your streak to Day 1**. This psychological pressure creates real accountability and builds genuine discipline.

## ✨ Features

- 🎯 **Challenge System**: Create 21, 30, 60, or 90-day challenges
- ✅ **Daily Check-ins**: Mark your progress every day
- 🔥 **Streak Tracking**: Build streaks with visual progress indicators
- 🏆 **Gamification**: Earn badges for milestones (7, 21, 30, 90 days)
- 📅 **Calendar Heatmap**: Visual representation of your progress
- 📊 **Statistics Dashboard**: Track your success rate and achievements
- 🌙 **Dark Mode UI**: Beautiful dark theme with neon green accents
- 🔐 **Secure Auth**: Email/password + Google OAuth

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (free tier works!)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mohamedbashirnux/Streak.git
cd Streak
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your credentials
```

Required variables:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: http://localhost:3000 (for development)

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🎮 How to Use

1. **Sign Up**: Create your account
2. **Create Challenge**: Choose a habit to build or break
3. **Set Duration**: Pick 21, 30, 60, or 90 days
4. **Daily Check-in**: Come back every day to mark your progress
5. **Build Streaks**: Don't break the chain!
6. **Earn Badges**: Unlock achievements at milestones

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📁 Project Structure

```
neverbreak/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── challenge/         # Challenge pages
│   ├── dashboard/         # Dashboard page
│   └── ...
├── components/            # React components
│   ├── auth/             # Authentication
│   ├── challenge/        # Challenge components
│   ├── ui/               # UI components
│   └── ...
├── lib/                  # Utilities
├── models/               # Mongoose models
├── store/                # Zustand stores
└── types/                # TypeScript types
```

## 🎨 Features in Detail

### Challenge Types
- **Avoid Habit**: Stop doing something (e.g., No Junk Food, No Social Media)
- **Build Habit**: Do something daily (e.g., Exercise, Read, Meditate)

### Badges System
- 🔥 **First Blood** - Complete Day 1
- 💪 **One Week Strong** - 7 day streak
- 🏆 **21 Day Warrior** - 21 day streak
- 👑 **30 Day Champion** - 30 day streak
- 💎 **Unbreakable** - Complete a 90 day challenge

### Statistics Tracking
- Total challenges created
- Completed vs failed challenges
- Overall success rate
- Longest streak ever
- Total days completed

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
- Set `MONGODB_URI` to your production MongoDB
- Generate new `NEXTAUTH_SECRET` for production
- Set `NEXTAUTH_URL` to your production domain
- Add Google OAuth credentials if using

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies.

---

**Start your journey today. Build discipline, one day at a time.** 🔥
