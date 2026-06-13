import { mysqlTable, varchar, int, text, datetime, json, decimal, boolean, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Users table (extended from Supabase auth)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  dateOfBirth: datetime("date_of_birth"),
  currentLevel: int("current_level").default(1),
  totalXP: int("total_xp").default(0),
  tier: varchar("tier", { length: 50 }).default("Foundation"),
  createdAt: datetime("created_at").defaultNow(),
  updatedAt: datetime("updated_at").defaultNow(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  usernamIdx: index("username_idx").on(table.username),
}));

// Mission completions table - stores each time a student completes a mission
export const missionCompletions = mysqlTable("mission_completions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  missionId: varchar("mission_id", { length: 100 }).notNull(),
  missionTitle: varchar("mission_title", { length: 255 }).notNull(),
  
  // Student answers - stored as JSON for flexibility
  studentAnswers: json("student_answers").$type<Record<string, string>>().notNull(),
  
  // XP and progress info
  xpEarned: int("xp_earned").notNull(),
  totalXPAfterCompletion: int("total_xp_after_completion").notNull(),
  levelAtCompletion: int("level_at_completion").notNull(),
  
  // DNA category impacted
  dnaCategory: varchar("dna_category", { length: 100 }),
  
  // Student info at time of completion
  ageAtCompletion: int("age_at_completion"),
  gradeLevel: varchar("grade_level", { length: 50 }),
  
  // Timestamps
  completedAt: datetime("completed_at").defaultNow(),
  createdAt: datetime("created_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  missionIdIdx: index("mission_id_idx").on(table.missionId),
  completedAtIdx: index("completed_at_idx").on(table.completedAt),
}));

// Student progress journal - aggregated view of all completions
export const progressJournal = mysqlTable("progress_journal", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  
  // Summary stats
  totalMissionsCompleted: int("total_missions_completed").default(0),
  totalXPEarned: int("total_xp_earned").default(0),
  currentLevel: int("current_level").default(1),
  currentTier: varchar("current_tier", { length: 50 }).default("Foundation"),
  
  // DNA traits growth
  dnaTraits: json("dna_traits").$type<Record<string, number>>().default({}),
  
  // Rewards earned
  rewardsEarned: json("rewards_earned").$type<string[]>().default([]),
  
  // Last activity
  lastCompletionDate: datetime("last_completion_date"),
  
  // Timestamps
  createdAt: datetime("created_at").defaultNow(),
  updatedAt: datetime("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
}));

// Graduation report template - stores graduation report data
export const graduationReports = mysqlTable("graduation_reports", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().unique(),
  
  // Student info
  studentName: varchar("student_name", { length: 255 }).notNull(),
  dateOfBirth: datetime("date_of_birth"),
  graduationDate: datetime("graduation_date"),
  
  // Overall stats
  totalMissionsCompleted: int("total_missions_completed").default(0),
  totalXPEarned: int("total_xp_earned").default(0),
  finalLevel: int("final_level").default(1),
  finalTier: varchar("final_tier", { length: 50 }),
  
  // Progress data
  completedMissions: json("completed_missions").$type<string[]>().default([]),
  xpGrowthTimeline: json("xp_growth_timeline").$type<Array<{ date: string; xp: number }>>().default([]),
  levelHistory: json("level_history").$type<Array<{ date: string; level: number }>>().default([]),
  
  // DNA traits
  dnaTraitsGrowth: json("dna_traits_growth").$type<Record<string, { initial: number; final: number }>>().default({}),
  
  // Skills assessment
  strongestSkills: json("strongest_skills").$type<string[]>().default([]),
  areasForImprovement: json("areas_for_improvement").$type<string[]>().default([]),
  
  // Goals
  goalsSet: json("goals_set").$type<string[]>().default([]),
  goalsCompleted: json("goals_completed").$type<string[]>().default([]),
  
  // Report metadata
  generatedAt: datetime("generated_at").defaultNow(),
  createdAt: datetime("created_at").defaultNow(),
  updatedAt: datetime("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  graduationDateIdx: index("graduation_date_idx").on(table.graduationDate),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  completions: many(missionCompletions),
  progressJournal: many(progressJournal),
  graduationReports: many(graduationReports),
}));

export const missionCompletionsRelations = relations(missionCompletions, ({ one }) => ({
  user: one(users, {
    fields: [missionCompletions.userId],
    references: [users.id],
  }),
}));

export const progressJournalRelations = relations(progressJournal, ({ one }) => ({
  user: one(users, {
    fields: [progressJournal.userId],
    references: [users.id],
  }),
}));

export const graduationReportsRelations = relations(graduationReports, ({ one }) => ({
  user: one(users, {
    fields: [graduationReports.userId],
    references: [users.id],
  }),
}));
