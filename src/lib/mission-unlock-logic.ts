import { Mission } from "./comprehensive-missions";

export interface UserProgress {
  user_id: string;
  completed_missions: string[];
  current_tier: "foundation" | "builder" | "operator" | "vault_prep";
  current_month: number;
  total_xp: number;
  date_of_birth: string;
}

/**
 * Determine which tier a user should be in based on age
 */
export function getTierByAge(dateOfBirth: string): "foundation" | "builder" | "operator" | "vault_prep" {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age === 13) return "foundation";
  if (age === 14) return "builder";
  if (age === 15) return "operator";
  return "vault_prep"; // 16-17
}

/**
 * Check if a mission is unlocked for the user
 */
export function isMissionUnlocked(
  mission: Mission,
  userProgress: UserProgress,
  allMissions: Mission[]
): boolean {
  // Check tier unlock requirement
  if (mission.unlock_requirement === "tier_unlock") {
    return mission.tier === userProgress.current_tier;
  }

  // Check if prerequisite mission is completed
  if (mission.unlock_requirement && mission.unlock_requirement !== "tier_unlock") {
    return userProgress.completed_missions.includes(mission.unlock_requirement);
  }

  return false;
}

/**
 * Get all available missions for a user
 */
export function getAvailableMissions(
  userProgress: UserProgress,
  allMissions: Mission[]
): Mission[] {
  return allMissions.filter((mission) => {
    // Only show missions from current tier
    if (mission.tier !== userProgress.current_tier) return false;

    // Check if mission is unlocked
    return isMissionUnlocked(mission, userProgress, allMissions);
  });
}

/**
 * Get all locked missions for a user
 */
export function getLockedMissions(
  userProgress: UserProgress,
  allMissions: Mission[]
): Mission[] {
  return allMissions.filter((mission) => {
    // Only show missions from current tier
    if (mission.tier !== userProgress.current_tier) return false;

    // Check if mission is NOT unlocked
    return !isMissionUnlocked(mission, userProgress, allMissions);
  });
}

/**
 * Calculate level from XP
 */
export function getLevelByXP(xp: number): number {
  // Foundation: 1-10 (0-5000 XP)
  // Builder: 11-25 (5000-15000 XP)
  // Operator: 26-40 (15000-30000 XP)
  // Vault Prep: 41-60 (30000-50000 XP)

  if (xp < 500) return 1;
  if (xp < 1000) return 2;
  if (xp < 1500) return 3;
  if (xp < 2000) return 4;
  if (xp < 2500) return 5;
  if (xp < 3000) return 6;
  if (xp < 3500) return 7;
  if (xp < 4000) return 8;
  if (xp < 4500) return 9;
  if (xp < 5000) return 10;
  if (xp < 6000) return 11;
  if (xp < 7000) return 12;
  if (xp < 8000) return 13;
  if (xp < 9000) return 14;
  if (xp < 10000) return 15;
  if (xp < 11000) return 16;
  if (xp < 12000) return 17;
  if (xp < 13000) return 18;
  if (xp < 14000) return 19;
  if (xp < 15000) return 20;
  if (xp < 17000) return 21;
  if (xp < 19000) return 22;
  if (xp < 21000) return 23;
  if (xp < 23000) return 24;
  if (xp < 25000) return 25;
  if (xp < 27000) return 26;
  if (xp < 29000) return 27;
  if (xp < 31000) return 28;
  if (xp < 33000) return 29;
  if (xp < 35000) return 30;
  if (xp < 37000) return 31;
  if (xp < 39000) return 32;
  if (xp < 41000) return 33;
  if (xp < 43000) return 34;
  if (xp < 45000) return 35;
  if (xp < 47000) return 36;
  if (xp < 49000) return 37;
  if (xp < 51000) return 38;
  if (xp < 53000) return 39;
  if (xp < 55000) return 40;
  if (xp < 58000) return 41;
  if (xp < 61000) return 42;
  if (xp < 64000) return 43;
  if (xp < 67000) return 44;
  if (xp < 70000) return 45;
  if (xp < 73000) return 46;
  if (xp < 76000) return 47;
  if (xp < 79000) return 48;
  if (xp < 82000) return 49;
  return 50;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  const thresholds = [
    0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000,
    11000, 12000, 13000, 14000, 15000, 17000, 19000, 21000, 23000, 25000, 27000, 29000, 31000,
    33000, 35000, 37000, 39000, 41000, 43000, 45000, 47000, 49000, 51000, 53000, 55000, 58000,
    61000, 64000, 67000, 70000, 73000, 76000, 79000, 82000, 100000,
  ];
  return thresholds[Math.min(currentLevel, 49)];
}

/**
 * Get progress to next level
 */
export function getProgressToNextLevel(currentXP: number, currentLevel: number): number {
  const currentThreshold = getXPForNextLevel(currentLevel);
  const nextThreshold = getXPForNextLevel(currentLevel + 1);
  const progress = currentXP - currentThreshold;
  const total = nextThreshold - currentThreshold;
  return Math.min(100, Math.max(0, (progress / total) * 100));
}

/**
 * Check if user should advance to next tier
 */
export function shouldAdvanceToNextTier(
  userProgress: UserProgress,
  allMissions: Mission[]
): boolean {
  const tierMissions = allMissions.filter((m) => m.tier === userProgress.current_tier);
  const completedTierMissions = tierMissions.filter((m) =>
    userProgress.completed_missions.includes(m.id)
  );

  // User must complete all missions in current tier to advance
  return completedTierMissions.length === tierMissions.length;
}

/**
 * Get next tier
 */
export function getNextTier(
  currentTier: "foundation" | "builder" | "operator" | "vault_prep"
): "foundation" | "builder" | "operator" | "vault_prep" | null {
  const tierMap = {
    foundation: "builder",
    builder: "operator",
    operator: "vault_prep",
    vault_prep: null,
  };
  return tierMap[currentTier] as any;
}
