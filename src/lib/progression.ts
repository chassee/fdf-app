/**
 * PHASE 0: Canonical Progression Module
 * 
 * This is the SINGLE SOURCE OF TRUTH for all progression calculations.
 * Every screen (Home, Missions, DNA, Ranks) must import from this module.
 * No screen may recompute level, XP, streak, or tier locally.
 */

/**
 * Level formula: XP required to REACH level L (cumulative)
 * = 100 * (L - 1) * L / 2
 * 
 * Examples:
 * - Level 1 → 0 XP
 * - Level 2 → 100 XP
 * - Level 3 → 300 XP
 * - Level 4 → 600 XP
 * - Level 5 → 1000 XP
 */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return 100 * (level - 1) * level / 2;
}

/**
 * Get the XP range for a specific level
 * Returns { xpStart, xpEnd } where xpStart is XP to reach this level,
 * and xpEnd is XP to reach the next level
 */
export function getXpRangeForLevel(level: number): { xpStart: number; xpEnd: number } {
  return {
    xpStart: xpRequiredForLevel(level),
    xpEnd: xpRequiredForLevel(level + 1),
  };
}

/**
 * Calculate current level from total XP
 */
export function getLevelFromXp(totalXp: number): number {
  let level = 1;
  while (xpRequiredForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

/**
 * Calculate XP into current level (0 to xpNeededForNext)
 */
export function getXpIntoCurrentLevel(totalXp: number): number {
  const currentLevel = getLevelFromXp(totalXp);
  const xpForCurrentLevel = xpRequiredForLevel(currentLevel);
  return totalXp - xpForCurrentLevel;
}

/**
 * Calculate XP needed to reach next level
 */
export function getXpNeededForNextLevel(totalXp: number): number {
  const currentLevel = getLevelFromXp(totalXp);
  const xpForCurrentLevel = xpRequiredForLevel(currentLevel);
  const xpForNextLevel = xpRequiredForLevel(currentLevel + 1);
  return xpForNextLevel - xpForCurrentLevel;
}

/**
 * Calculate progress percentage (0-100) into current level
 */
export function getProgressPercent(totalXp: number): number {
  const xpIntoLevel = getXpIntoCurrentLevel(totalXp);
  const xpNeededForLevel = getXpNeededForNextLevel(totalXp);
  
  if (xpNeededForLevel === 0) return 0;
  return Math.round((xpIntoLevel / xpNeededForLevel) * 100);
}

/**
 * Get tier from level
 * Foundation: Levels 1-2
 * Builder: Levels 3-4
 * Operator: Levels 5+
 */
export function getTierFromLevel(level: number): 'Foundation' | 'Builder' | 'Operator' {
  if (level <= 2) return 'Foundation';
  if (level <= 4) return 'Builder';
  return 'Operator';
}

/**
 * Calculate current streak from last checkin date
 * If last checkin was today, streak continues
 * If last checkin was yesterday, streak continues
 * If last checkin was 2+ days ago, streak resets to 0
 */
export function calculateCurrentStreak(lastCheckinDate: string | null): number {
  if (!lastCheckinDate) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCheckin = new Date(lastCheckinDate);
  lastCheckin.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24));
  
  // If checkin was today or yesterday, streak continues
  if (daysDiff <= 1) return 1; // Will be incremented from database value
  
  // If checkin was 2+ days ago, streak resets
  return 0;
}

/**
 * Complete progression state derived from total XP
 */
export interface ProgressionState {
  totalXp: number;
  currentLevel: number;
  xpIntoCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
  tier: 'Foundation' | 'Builder' | 'Operator';
  currentStreak: number;
  longestStreak: number;
}

/**
 * Calculate complete progression state from total XP and streak data
 * This is the main function that all screens should call
 */
export function getProgressionState(
  totalXp: number,
  currentStreak: number = 0,
  longestStreak: number = 0
): ProgressionState {
  const currentLevel = getLevelFromXp(totalXp);
  const xpIntoCurrentLevel = getXpIntoCurrentLevel(totalXp);
  const xpNeededForNextLevel = getXpNeededForNextLevel(totalXp);
  const progressPercent = getProgressPercent(totalXp);
  const tier = getTierFromLevel(currentLevel);
  
  return {
    totalXp,
    currentLevel,
    xpIntoCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
    tier,
    currentStreak,
    longestStreak,
  };
}

/**
 * Validate that a mission is unlocked for the current level
 */
export function isMissionUnlocked(missionLevelRequired: number, currentLevel: number): boolean {
  return currentLevel >= missionLevelRequired;
}

/**
 * Get missions unlocked at a specific level
 */
export function getMissionsUnlockedAtLevel(level: number): number {
  // This will be used with mission_definitions table
  // For now, just a placeholder
  return level;
}
