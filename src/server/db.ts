import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../../drizzle/schema";

let db: ReturnType<typeof drizzle> | null = null;

export async function getDB() {
  if (db) return db;

  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL || "",
  });

  db = drizzle(connection, { schema });
  return db;
}

// Mission completion queries
export async function saveMissionCompletion(data: {
  id: string;
  userId: string;
  missionId: string;
  missionTitle: string;
  studentAnswers: Record<string, string>;
  xpEarned: number;
  totalXPAfterCompletion: number;
  levelAtCompletion: number;
  dnaCategory?: string;
  ageAtCompletion?: number;
  gradeLevel?: string;
}) {
  const database = await getDB();
  return database.insert(schema.missionCompletions).values(data);
}

export async function getMissionCompletionsByUserId(userId: string) {
  const database = await getDB();
  return database
    .select()
    .from(schema.missionCompletions)
    .where((table) => table.userId === userId)
    .orderBy((table) => table.completedAt);
}

export async function getMissionCompletionById(id: string) {
  const database = await getDB();
  return database
    .select()
    .from(schema.missionCompletions)
    .where((table) => table.id === id)
    .limit(1);
}

// Progress journal queries
export async function getOrCreateProgressJournal(userId: string) {
  const database = await getDB();
  const existing = await database
    .select()
    .from(schema.progressJournal)
    .where((table) => table.userId === userId)
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Create new progress journal
  const newJournal = {
    id: crypto.randomUUID(),
    userId,
    totalMissionsCompleted: 0,
    totalXPEarned: 0,
    currentLevel: 1,
    currentTier: "Foundation",
  };

  await database.insert(schema.progressJournal).values(newJournal);
  return newJournal;
}

export async function updateProgressJournal(userId: string, updates: any) {
  const database = await getDB();
  return database
    .update(schema.progressJournal)
    .set(updates)
    .where((table) => table.userId === userId);
}

// Graduation report queries
export async function createGraduationReport(data: {
  id: string;
  userId: string;
  studentName: string;
  dateOfBirth?: Date;
  graduationDate?: Date;
  totalMissionsCompleted: number;
  totalXPEarned: number;
  finalLevel: number;
  finalTier: string;
  completedMissions?: string[];
  xpGrowthTimeline?: Array<{ date: string; xp: number }>;
  levelHistory?: Array<{ date: string; level: number }>;
  dnaTraitsGrowth?: Record<string, { initial: number; final: number }>;
  strongestSkills?: string[];
  areasForImprovement?: string[];
  goalsSet?: string[];
  goalsCompleted?: string[];
}) {
  const database = await getDB();
  return database.insert(schema.graduationReports).values(data);
}

export async function getGraduationReport(userId: string) {
  const database = await getDB();
  return database
    .select()
    .from(schema.graduationReports)
    .where((table) => table.userId === userId)
    .limit(1);
}

export async function updateGraduationReport(userId: string, updates: any) {
  const database = await getDB();
  return database
    .update(schema.graduationReports)
    .set(updates)
    .where((table) => table.userId === userId);
}

// User queries
export async function getUserById(userId: string) {
  const database = await getDB();
  return database
    .select()
    .from(schema.users)
    .where((table) => table.id === userId)
    .limit(1);
}

export async function updateUser(userId: string, updates: any) {
  const database = await getDB();
  return database
    .update(schema.users)
    .set(updates)
    .where((table) => table.id === userId);
}
