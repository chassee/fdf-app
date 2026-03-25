import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module to avoid real DB calls
vi.mock("./db", () => ({
  getFdfUserByUserId: vi.fn(),
  getFdfProgress: vi.fn(),
  calculateAge: vi.fn(),
  calculateRank: vi.fn(),
  calculateVaultActivationDate: vi.fn().mockReturnValue("2027-01-01"),
  createFdfUser: vi.fn(),
  createFdfProgress: vi.fn(),
  getActiveMissions: vi.fn(),
  getUserMissionCompletions: vi.fn(),
  getAllRewards: vi.fn(),
  getUserRewards: vi.fn(),
  updateFdfProgress: vi.fn(),
  unlockReward: vi.fn(),
  createMissionCompletion: vi.fn(),
  updateMissionCompletion: vi.fn(),
  createSponsorLead: vi.fn(),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("fdf.getProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null fdfUser and progress when user has no FDF profile", async () => {
    vi.mocked(db.getFdfUserByUserId).mockResolvedValue(undefined);
    vi.mocked(db.getFdfProgress).mockResolvedValue(undefined);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.fdf.getProfile();

    expect(result.fdfUser).toBeUndefined();
    expect(result.progress).toBeUndefined();
    expect(result.baseUser.id).toBe(1);
  });

  it("returns fdfUser and progress when user has FDF profile", async () => {
    const mockFdfUser = {
      id: 1,
      userId: 1,
      dob: "2009-01-01",
      dawgClass: "builder" as const,
      yearTrack: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockProgress = {
      id: 1,
      userId: 1,
      xpTotal: 500,
      gemsTotal: 120,
      rankName: "Scout",
      streakDays: 3,
      lastCheckIn: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getFdfUserByUserId).mockResolvedValue(mockFdfUser as any);
    vi.mocked(db.getFdfProgress).mockResolvedValue(mockProgress as any);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.fdf.getProfile();

    expect(result.fdfUser).toBeDefined();
    expect(result.progress?.xpTotal).toBe(500);
    expect(result.progress?.rankName).toBe("Scout");
  });
});

describe("fdf.getMissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns missions and completions", async () => {
    const mockFdfUser = {
      id: 1, userId: 1, dob: "2009-01-01", dawgClass: "builder" as const,
      yearTrack: 1, createdAt: new Date(), updatedAt: new Date(),
    };
    const mockMissions = [
      { id: 1, title: "Save $5 this week", xpReward: 120, gemReward: 20, difficulty: "easy", category: "saving", weekNumber: 1, isActive: true, description: "Put $5 in savings", createdAt: new Date() },
      { id: 2, title: "Sell a product for $10", xpReward: 200, gemReward: 35, difficulty: "medium", category: "selling", weekNumber: 1, isActive: true, description: "Make your first sale", createdAt: new Date() },
    ];

    const mockCompletions: any[] = [];

    vi.mocked(db.getFdfUserByUserId).mockResolvedValue(mockFdfUser as any);
    vi.mocked(db.getActiveMissions).mockResolvedValue(mockMissions as any);
    vi.mocked(db.getUserMissionCompletions).mockResolvedValue(mockCompletions);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.fdf.getMissions();

    expect(result.missions).toHaveLength(2);
    expect(result.completions).toHaveLength(0);
    expect(result.missions[0].title).toBe("Save $5 this week");
  });
});

describe("fdf.getRewards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns rewards and user rewards", async () => {
    const mockRewards = [
      { id: 1, name: "Builder Badge", gemCost: 200, type: "badge", rarity: "common", isNew: false, imageUrl: null, createdAt: new Date() },
      { id: 2, name: "Atlas Dawg", gemCost: 300, type: "badge", rarity: "rare", isNew: true, imageUrl: null, createdAt: new Date() },
    ];

    const mockUserRewards: any[] = [];

    vi.mocked(db.getAllRewards).mockResolvedValue(mockRewards as any);
    vi.mocked(db.getUserRewards).mockResolvedValue(mockUserRewards);

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.fdf.getRewards();

    expect(result.allRewards).toHaveLength(2);
    expect(result.userRewards).toHaveLength(0);
    expect(result.allRewards[0].name).toBe("Builder Badge");
    expect(result.allRewards[1].isNew).toBe(true);
  });
});

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
  });
});
