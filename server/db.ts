import { eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  fdfUsers,
  fdfProgress,
  missions,
  missionCompletions,
  rewards,
  userRewards,
  sponsorLeads,
  type FdfUser,
  type FdfProgress,
  type Mission,
  type Reward,
  type InsertFdfUser,
  type InsertFdfProgress,
  type InsertMissionCompletion,
  type InsertUserReward,
  type InsertSponsorLead,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// FDF-specific queries

export async function getFdfUserByUserId(userId: number): Promise<FdfUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(fdfUsers)
    .where(eq(fdfUsers.userId, userId))
    .limit(1);

  return result[0];
}

export async function createFdfUser(data: InsertFdfUser): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(fdfUsers).values(data);
}

export async function updateFdfUser(userId: number, data: Partial<InsertFdfUser>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(fdfUsers).set(data).where(eq(fdfUsers.userId, userId));
}

export async function getFdfProgress(userId: number): Promise<FdfProgress | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(fdfProgress)
    .where(eq(fdfProgress.userId, userId))
    .limit(1);

  return result[0];
}

export async function createFdfProgress(data: InsertFdfProgress): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(fdfProgress).values(data);
}

export async function updateFdfProgress(userId: number, data: Partial<InsertFdfProgress>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(fdfProgress).set(data).where(eq(fdfProgress.userId, userId));
}

export async function getActiveMissions(yearTrack: number): Promise<Mission[]> {
  const db = await getDb();
  if (!db) return [];

  const today = new Date().toISOString().split('T')[0];
  
  const result = await db
    .select()
    .from(missions)
    .where(
      and(
        eq(missions.yearTrack, yearTrack),
        eq(missions.isActive, 1),
        lte(missions.weekStart, today),
        gte(missions.weekEnd, today)
      )
    );

  return result;
}

export async function getUserMissionCompletions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(missionCompletions)
    .where(eq(missionCompletions.userId, userId));
}

export async function createMissionCompletion(data: InsertMissionCompletion): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(missionCompletions).values(data);
}

export async function updateMissionCompletion(
  userId: number,
  missionId: number,
  status: "started" | "completed" | "claimed"
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(missionCompletions)
    .set({ status, claimedAt: status === "claimed" ? new Date() : undefined })
    .where(
      and(
        eq(missionCompletions.userId, userId),
        eq(missionCompletions.missionId, missionId)
      )
    );
}

export async function getAllRewards(): Promise<Reward[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(rewards);
}

export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(userRewards)
    .where(eq(userRewards.userId, userId));
}

export async function unlockReward(data: InsertUserReward): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userRewards).values(data);
}

export async function createSponsorLead(data: InsertSponsorLead): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(sponsorLeads).values(data);
}

// Helper: Calculate rank from XP
export function calculateRank(xp: number): string {
  if (xp >= 15000) return "Atlas Elite";
  if (xp >= 9000) return "Vaultborn";
  if (xp >= 5000) return "Operator";
  if (xp >= 2500) return "Builder";
  if (xp >= 1200) return "Runner";
  if (xp >= 500) return "Rookie";
  return "Pup";
}

// Helper: Calculate age from DOB
export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Helper: Calculate vault activation date (18th birthday)
export function calculateVaultActivationDate(dob: string): string {
  const birthDate = new Date(dob);
  birthDate.setFullYear(birthDate.getFullYear() + 18);
  return birthDate.toISOString().split('T')[0];
}
