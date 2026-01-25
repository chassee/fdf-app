import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * FDF-specific user profile
 */
export const fdfUsers = mysqlTable("fdf_users", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  displayName: varchar("display_name", { length: 255 }),
  dob: varchar("dob", { length: 10 }).notNull(), // YYYY-MM-DD
  country: varchar("country", { length: 100 }),
  dawgClass: mysqlEnum("dawg_class", ["builder", "creator", "tech", "money"]),
  yearTrack: int("year_track").notNull().default(1), // 1-4
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FdfUser = typeof fdfUsers.$inferSelect;
export type InsertFdfUser = typeof fdfUsers.$inferInsert;

/**
 * User progress tracking
 */
export const fdfProgress = mysqlTable("fdf_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  xpTotal: int("xp_total").notNull().default(0),
  gemsTotal: int("gems_total").notNull().default(0),
  rankName: varchar("rank_name", { length: 50 }).notNull().default("Pup"),
  streakDays: int("streak_days").notNull().default(0),
  lastCheckin: varchar("last_checkin", { length: 10 }), // YYYY-MM-DD
  vaultActivationDate: varchar("vault_activation_date", { length: 10 }), // YYYY-MM-DD
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FdfProgress = typeof fdfProgress.$inferSelect;
export type InsertFdfProgress = typeof fdfProgress.$inferInsert;

/**
 * Missions
 */
export const missions = mysqlTable("missions", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  yearTrack: int("year_track").notNull(), // 1-4
  xpReward: int("xp_reward").notNull(),
  gemsReward: int("gems_reward").notNull(),
  weekStart: varchar("week_start", { length: 10 }).notNull(), // YYYY-MM-DD
  weekEnd: varchar("week_end", { length: 10 }).notNull(), // YYYY-MM-DD
  isActive: int("is_active").notNull().default(1), // 1 = true, 0 = false
});

export type Mission = typeof missions.$inferSelect;
export type InsertMission = typeof missions.$inferInsert;

/**
 * Mission completions
 */
export const missionCompletions = mysqlTable("mission_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  missionId: int("mission_id").notNull().references(() => missions.id),
  status: mysqlEnum("status", ["started", "completed", "claimed"]).notNull().default("started"),
  claimedAt: timestamp("claimed_at"),
});

export type MissionCompletion = typeof missionCompletions.$inferSelect;
export type InsertMissionCompletion = typeof missionCompletions.$inferInsert;

/**
 * Rewards
 */
export const rewards = mysqlTable("rewards", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  type: mysqlEnum("type", ["badge", "sticker", "frame"]).notNull(),
  costGems: int("cost_gems").notNull(),
  rarity: mysqlEnum("rarity", ["common", "rare", "legendary"]).notNull().default("common"),
  imageUrl: text("image_url").notNull(),
});

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = typeof rewards.$inferInsert;

/**
 * User rewards (unlocked)
 */
export const userRewards = mysqlTable("user_rewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  rewardId: int("reward_id").notNull().references(() => rewards.id),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = typeof userRewards.$inferInsert;

/**
 * Sponsor leads
 */
export const sponsorLeads = mysqlTable("sponsor_leads", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: varchar("email", { length: 320 }).notNull(),
  budget: text("budget"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SponsorLead = typeof sponsorLeads.$inferSelect;
export type InsertSponsorLead = typeof sponsorLeads.$inferInsert;