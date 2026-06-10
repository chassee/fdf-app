import { Mission, getAvailableMissions } from "./missions";

/**
 * Check if a mission is unlocked for a given level
 * A mission is unlocked if the user's level >= mission's required level
 */
export function isMissionUnlocked(mission: Mission, userLevel: number): boolean {
  return userLevel >= mission.level;
}

/**
 * Get all missions available for a user's current level
 * (already available in missions.ts as getAvailableMissions)
 */
export function getUnlockedMissions(userLevel: number): Mission[] {
  return getAvailableMissions(userLevel);
}

/**
 * Get all missions that are locked for a user
 */
export function getLockedMissions(userLevel: number): Mission[] {
  const allMissions = getAvailableMissions(50); // Get all missions
  return allMissions.filter((m) => !isMissionUnlocked(m, userLevel));
}

/**
 * Get the next mission to unlock after completing current missions
 */
export function getNextMissionToUnlock(userLevel: number, completedMissionIds: string[]): Mission | null {
  const allMissions = getAvailableMissions(50);
  const lockedMissions = getLockedMissions(userLevel);

  if (lockedMissions.length === 0) return null;

  // Return the first locked mission (lowest level requirement)
  return lockedMissions.sort((a, b) => a.level - b.level)[0] || null;
}

/**
 * Calculate XP needed to reach next level
 */
export function getXPToNextLevel(currentXP: number): number {
  const currentLevel = Math.floor(currentXP / 100) + 1;
  const nextLevelXP = currentLevel * 100;
  return Math.max(0, nextLevelXP - currentXP);
}

/**
 * Calculate XP needed to unlock a specific mission
 */
export function getXPToUnlockMission(mission: Mission, currentXP: number): number {
  const currentLevel = Math.floor(currentXP / 100) + 1;
  if (currentLevel >= mission.level) return 0; // Already unlocked

  const requiredXP = (mission.level - 1) * 100;
  return Math.max(0, requiredXP - currentXP);
}

/**
 * Get unlock progress for a specific mission
 * Returns { isUnlocked, progressPercent, xpNeeded }
 */
export function getMissionUnlockProgress(
  mission: Mission,
  currentXP: number
): {
  isUnlocked: boolean;
  progressPercent: number;
  xpNeeded: number;
} {
  const currentLevel = Math.floor(currentXP / 100) + 1;
  const isUnlocked = currentLevel >= mission.level;

  if (isUnlocked) {
    return { isUnlocked: true, progressPercent: 100, xpNeeded: 0 };
  }

  const requiredXP = (mission.level - 1) * 100;
  const xpNeeded = requiredXP - currentXP;
  const progressPercent = Math.round(((currentXP - (mission.level - 2) * 100) / 100) * 100);

  return {
    isUnlocked: false,
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
    xpNeeded: Math.max(0, xpNeeded),
  };
}
