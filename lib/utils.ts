// Server-side utilities only
// This file should only be imported by API routes and server components

// Re-export client-safe functions for server use
export { 
  badges, 
  getBadgeForStreak, 
  XP_REWARDS, 
  calculateLevel, 
  getXPForLevel, 
  getXPForNextLevel, 
  getCurrentLevelProgress,
  generateDailyChallenges 
} from "./client-utils";

// Import functions needed for server-side operations
import { calculateLevel } from "./client-utils";

// Server-side XP awarding function
export async function awardXP(userId: string, xpAmount: number, reason: string): Promise<any> {
  // This function will be called from server-side API routes only
  // We'll import the dependencies dynamically to avoid client-side bundling issues
  try {
    const connectDB = (await import("./mongodb")).default;
    const UserModel = (await import("@/models/User")).default;
    
    await connectDB();
    
    const user = await UserModel.findById(userId);
    if (!user) return null;

    const newTotalXP = user.totalXP + xpAmount;
    const newLevel = calculateLevel(newTotalXP);
    const leveledUp = newLevel > user.level;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        totalXP: newTotalXP,
        level: newLevel,
        $inc: { xp: xpAmount }
      },
      { new: true }
    );

    // Log XP gain (you could store this in a separate collection if needed)
    console.log(`User ${user.name} earned ${xpAmount} XP for ${reason}${leveledUp ? ` and leveled up to ${newLevel}!` : ''}`);

    return updatedUser;
  } catch (error) {
    console.error('Error awarding XP:', error);
    return null;
  }
}
