# NeverBreak Setup Guide

## Quick Start

### 1. Environment Setup

Make sure you have MongoDB running. You can either:

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start it
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env.local` with your Atlas URI

### 2. Configure Environment Variables

The `.env.local` file is already created. Update these values:

```env
# MongoDB - Update this with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/neverbreak

# NextAuth - Generate a secret key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production

# Google OAuth (Optional - leave empty if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
# Run this command to generate a random secret
openssl rand -base64 32
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

1. **Sign Up**: Create your account at `/signup`
2. **Create Challenge**: Click "New Challenge" to create your first streak
3. **Daily Check-in**: Come back every day to mark your progress
4. **Track Stats**: View your statistics and earned badges

## Features Overview

### Challenge Types
- **Avoid Habit**: Stop doing something bad (e.g., No Junk Food, No Social Media)
- **Build Habit**: Do something good daily (e.g., Exercise, Read, Meditate)

### Duration Options
- 21 days (3 weeks)
- 30 days (1 month)
- 60 days (2 months)
- 90 days (3 months)
- Custom duration

### Badges You Can Earn
- 🔥 **First Blood** - Complete Day 1
- 💪 **One Week Strong** - 7 day streak
- 🏆 **21 Day Warrior** - 21 day streak
- 👑 **30 Day Champion** - 30 day streak
- 💎 **Unbreakable** - Complete a 90 day challenge

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check your `MONGODB_URI` in `.env.local`
- For Atlas, ensure your IP is whitelisted

### NextAuth Error
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Make sure `NEXTAUTH_URL` matches your dev server URL

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
- Set `MONGODB_URI` to your production MongoDB
- Generate new `NEXTAUTH_SECRET` for production
- Set `NEXTAUTH_URL` to your production domain
- Add Google OAuth credentials if using

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- MongoDB + Mongoose
- NextAuth.js v5
- Zustand (State Management)
- Framer Motion (Animations)
- React Hot Toast (Notifications)

## Need Help?
Check the main README.md for more details about the project structure and API endpoints.
