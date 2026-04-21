/**
 * FDF Level System
 * Multi-year progression platform with 3 tiers and 50 levels
 */

export interface LevelInfo {
  level: number;
  tier: "Foundation" | "Builder" | "Operator";
  title: string;
  description: string;
  xpRequired: number; // XP needed to reach this level
  xpTotal: number; // Total XP accumulated by this level
  unlocksFeatures: string[];
}

const LEVELS: LevelInfo[] = [
  // FOUNDATION TIER (Levels 1-10): Ages 13-14, Financial Basics
  {
    level: 1,
    tier: "Foundation",
    title: "Financial Newbie",
    description: "Just starting your financial journey",
    xpRequired: 0,
    xpTotal: 0,
    unlocksFeatures: ["missions", "dashboard"],
  },
  {
    level: 2,
    tier: "Foundation",
    title: "Saver",
    description: "Learning the basics of saving",
    xpRequired: 100,
    xpTotal: 100,
    unlocksFeatures: ["dna_page"],
  },
  {
    level: 3,
    tier: "Foundation",
    title: "Goal Setter",
    description: "Setting your first financial goals",
    xpRequired: 200,
    xpTotal: 300,
    unlocksFeatures: ["advanced_missions"],
  },
  {
    level: 4,
    tier: "Foundation",
    title: "Skill Identifier",
    description: "Identifying your unique skills",
    xpRequired: 300,
    xpTotal: 600,
    unlocksFeatures: [],
  },
  {
    level: 5,
    tier: "Foundation",
    title: "Money Aware",
    description: "Understanding money fundamentals",
    xpRequired: 400,
    xpTotal: 1000,
    unlocksFeatures: ["leaderboard"],
  },
  {
    level: 6,
    tier: "Foundation",
    title: "Budgeter",
    description: "Creating your first budget",
    xpRequired: 500,
    xpTotal: 1500,
    unlocksFeatures: [],
  },
  {
    level: 7,
    tier: "Foundation",
    title: "Income Thinker",
    description: "Exploring income opportunities",
    xpRequired: 600,
    xpTotal: 2100,
    unlocksFeatures: [],
  },
  {
    level: 8,
    tier: "Foundation",
    title: "Investor Curious",
    description: "Learning about investing basics",
    xpRequired: 700,
    xpTotal: 2800,
    unlocksFeatures: [],
  },
  {
    level: 9,
    tier: "Foundation",
    title: "Debt Aware",
    description: "Understanding debt and credit",
    xpRequired: 800,
    xpTotal: 3600,
    unlocksFeatures: [],
  },
  {
    level: 10,
    tier: "Foundation",
    title: "Foundation Master",
    description: "Completed Foundation tier",
    xpRequired: 900,
    xpTotal: 4500,
    unlocksFeatures: ["builder_tier"],
  },

  // BUILDER TIER (Levels 11-25): Ages 14-16, Entrepreneurship & Advanced Skills
  {
    level: 11,
    tier: "Builder",
    title: "Entrepreneur Starter",
    description: "Beginning your entrepreneurial journey",
    xpRequired: 1000,
    xpTotal: 5500,
    unlocksFeatures: ["builder_missions"],
  },
  {
    level: 12,
    tier: "Builder",
    title: "Idea Developer",
    description: "Developing your first business idea",
    xpRequired: 1100,
    xpTotal: 6600,
    unlocksFeatures: [],
  },
  {
    level: 13,
    tier: "Builder",
    title: "Market Researcher",
    description: "Understanding your market",
    xpRequired: 1200,
    xpTotal: 7800,
    unlocksFeatures: [],
  },
  {
    level: 14,
    tier: "Builder",
    title: "Product Thinker",
    description: "Designing your product or service",
    xpRequired: 1300,
    xpTotal: 9100,
    unlocksFeatures: [],
  },
  {
    level: 15,
    tier: "Builder",
    title: "MVP Creator",
    description: "Building your minimum viable product",
    xpRequired: 1400,
    xpTotal: 10500,
    unlocksFeatures: [],
  },
  {
    level: 16,
    tier: "Builder",
    title: "Sales Starter",
    description: "Learning sales fundamentals",
    xpRequired: 1500,
    xpTotal: 12000,
    unlocksFeatures: [],
  },
  {
    level: 17,
    tier: "Builder",
    title: "Customer Connector",
    description: "Building customer relationships",
    xpRequired: 1600,
    xpTotal: 13600,
    unlocksFeatures: [],
  },
  {
    level: 18,
    tier: "Builder",
    title: "Growth Hacker",
    description: "Growing your user base",
    xpRequired: 1700,
    xpTotal: 15300,
    unlocksFeatures: [],
  },
  {
    level: 19,
    tier: "Builder",
    title: "Finance Manager",
    description: "Managing business finances",
    xpRequired: 1800,
    xpTotal: 17100,
    unlocksFeatures: [],
  },
  {
    level: 20,
    tier: "Builder",
    title: "Team Leader",
    description: "Leading your first team",
    xpRequired: 1900,
    xpTotal: 19000,
    unlocksFeatures: [],
  },
  {
    level: 21,
    tier: "Builder",
    title: "Scale Thinker",
    description: "Planning to scale your business",
    xpRequired: 2000,
    xpTotal: 21000,
    unlocksFeatures: [],
  },
  {
    level: 22,
    tier: "Builder",
    title: "Partnership Builder",
    description: "Building strategic partnerships",
    xpRequired: 2100,
    xpTotal: 23100,
    unlocksFeatures: [],
  },
  {
    level: 23,
    tier: "Builder",
    title: "Risk Manager",
    description: "Understanding business risks",
    xpRequired: 2200,
    xpTotal: 25300,
    unlocksFeatures: [],
  },
  {
    level: 24,
    tier: "Builder",
    title: "Innovation Thinker",
    description: "Driving innovation in your business",
    xpRequired: 2300,
    xpTotal: 27600,
    unlocksFeatures: [],
  },
  {
    level: 25,
    tier: "Builder",
    title: "Builder Master",
    description: "Completed Builder tier",
    xpRequired: 2400,
    xpTotal: 30000,
    unlocksFeatures: ["operator_tier"],
  },

  // OPERATOR TIER (Levels 26-50): Ages 16-17, Advanced Mastery & Vault Access
  {
    level: 26,
    tier: "Operator",
    title: "Operator Initiate",
    description: "Entering the Operator tier",
    xpRequired: 2500,
    xpTotal: 32500,
    unlocksFeatures: ["operator_missions", "vault_preview"],
  },
  {
    level: 27,
    tier: "Operator",
    title: "Systems Thinker",
    description: "Understanding complex systems",
    xpRequired: 2600,
    xpTotal: 35100,
    unlocksFeatures: [],
  },
  {
    level: 28,
    tier: "Operator",
    title: "Data Analyst",
    description: "Analyzing business data",
    xpRequired: 2700,
    xpTotal: 37800,
    unlocksFeatures: [],
  },
  {
    level: 29,
    tier: "Operator",
    title: "Strategic Planner",
    description: "Creating strategic plans",
    xpRequired: 2800,
    xpTotal: 40600,
    unlocksFeatures: [],
  },
  {
    level: 30,
    tier: "Operator",
    title: "Operator Expert",
    description: "Expert in operations",
    xpRequired: 2900,
    xpTotal: 43500,
    unlocksFeatures: ["vault_access"],
  },
  // Levels 31-50 follow similar pattern with increasing XP requirements
  ...Array.from({ length: 20 }, (_, i) => ({
    level: 31 + i,
    tier: "Operator" as const,
    title: `Operator Level ${31 + i}`,
    description: `Advanced mastery level ${31 + i}`,
    xpRequired: 3000 + i * 100,
    xpTotal: 46500 + i * 3000,
    unlocksFeatures: [],
  })),
];

export function getLevelInfo(level: number): LevelInfo | null {
  return LEVELS.find((l) => l.level === level) || null;
}

export function getLevelByXP(xp: number): LevelInfo {
  // Find the highest level where xpTotal <= xp
  const level = LEVELS.filter((l) => l.xpTotal <= xp).pop() || LEVELS[0];
  return level;
}

export function getXPToNextLevel(xp: number): number {
  const currentLevel = getLevelByXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0; // Max level
  return nextLevel.xpTotal - xp;
}

export function getProgressToNextLevel(xp: number): number {
  const currentLevel = getLevelByXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  if (!nextLevel) return 100; // Max level

  const xpInCurrentLevel = xp - currentLevel.xpTotal;
  const xpNeededForLevel = nextLevel.xpTotal - currentLevel.xpTotal;
  return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
}

export function getAllLevels(): LevelInfo[] {
  return LEVELS;
}

export function getLevelsByTier(tier: "Foundation" | "Builder" | "Operator"): LevelInfo[] {
  return LEVELS.filter((l) => l.tier === tier);
}
