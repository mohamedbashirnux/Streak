# Database Cleanup Instructions

## ✅ What Was Removed:

### Code Removed:
- ❌ All category pages (`app/category/`)
- ❌ All category API routes (`app/api/categories/`)
- ❌ Category model (`models/Category.ts`)
- ❌ CategoryCard component
- ❌ Category types from `types/index.ts`
- ❌ "Multiple Habits" option from Create Tracker modal
- ❌ Category fetching from dashboard

### What Remains:
- ✅ Single habit challenges only
- ✅ Simple, clean interface
- ✅ All existing challenge features

---

## 🗑️ Clean Your MongoDB Database

You have **2 options** to clean your database:

### Option 1: Manual Cleanup (MongoDB Atlas Dashboard)

1. Go to https://cloud.mongodb.com/
2. Login to your account
3. Click on your cluster → "Browse Collections"
4. Delete these collections:
   - `categories` (if exists)
   - `challenges` (to start fresh)
   - `users` (optional - only if you want to reset accounts)
   - `stats` (optional - only if you want to reset stats)

---

### Option 2: Automated Script (Recommended)

1. **Update the script with your MongoDB URI:**

```bash
# Open the cleanup script
code scripts/cleanup-database.js
```

2. **Replace the connection string** with your actual MongoDB URI from `.env.local`:

```javascript
const MONGODB_URI = 'your-actual-mongodb-connection-string-here';
```

3. **Run the cleanup script:**

```bash
node scripts/cleanup-database.js
```

This will:
- Drop ALL collections (users, challenges, categories, stats)
- Give you a completely fresh start

---

## 🚀 After Cleanup:

1. **Restart your dev server:**
```bash
npm run dev
```

2. **Create a new account** (old accounts are deleted)

3. **Create your first habit tracker** - Simple and clean!

---

## 📝 Notes:

- The app is now **much simpler** - only single habit tracking
- No more confusing category logic
- Cleaner dashboard
- Easier to understand and use

---

## ⚠️ Warning:

Running the cleanup script will **DELETE ALL DATA** from your database. Make sure you're okay with losing:
- All user accounts
- All challenges
- All categories
- All stats

This cannot be undone!
