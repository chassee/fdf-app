/**
 * FDF Missions System
 * Real missions that unlock after onboarding
 */

export interface Question {
  id: string;
  text: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  tier: "Foundation" | "Builder" | "Operator";
  level: number; // Minimum level to unlock
  status: "not_started" | "in_progress" | "complete";
  timeEstimate: string; // e.g., "5 min", "10 min"
  icon: string; // emoji
  questions?: Question[]; // Questions for students to answer
  dnaCategory?: string; // DNA trait this mission impacts
}

const MISSIONS: Mission[] = [
  // FOUNDATION TIER - Starter Missions (Available immediately after onboarding)
  {
    id: "mission_1",
    title: "Daily Check-In",
    description: "Start your day by checking in. This is your first step to building a consistent financial habit.",
    xpReward: 50,
    tier: "Foundation",
    level: 1,
    status: "not_started",
    timeEstimate: "2 min",
    icon: "📅",
    dnaCategory: "Awareness",
    questions: [
      { id: "q1_1", text: "How much money do you have right now?" },
      { id: "q1_2", text: "Did you spend money today? On what?" },
      { id: "q1_3", text: "Did you save any money today?" },
      { id: "q1_4", text: "Are you on track with your goals? Why or why not?" },
    ],
  },
  {
    id: "mission_2",
    title: "Saving Basics",
    description: "Learn the fundamentals of saving money. Understand the power of compound growth.",
    xpReward: 100,
    tier: "Foundation",
    level: 1,
    status: "not_started",
    timeEstimate: "5 min",
    icon: "💰",
    dnaCategory: "Discipline",
    questions: [
      { id: "q2_1", text: "How much money can you save per week?" },
      { id: "q2_2", text: "Calculate: If you save $10/week for 1 year at 5% interest, how much will you have?" },
      { id: "q2_3", text: "What is one thing you could cut from your spending to save more?" },
    ],
  },
  {
    id: "mission_3",
    title: "Set Your First Goal",
    description: "Define a financial goal for the next 3 months. What do you want to save for?",
    xpReward: 100,
    tier: "Foundation",
    level: 1,
    status: "not_started",
    timeEstimate: "10 min",
    icon: "🎯",
    dnaCategory: "Vision",
    questions: [
      { id: "q3_1", text: "What do you want to save for?" },
      { id: "q3_2", text: "How much money do you need?" },
      { id: "q3_3", text: "When do you want to have it by?" },
      { id: "q3_4", text: "How much can you save per week to reach this goal?" },
    ],
  },
  {
    id: "mission_4",
    title: "Identify a Skill",
    description: "Think about a skill you have or want to develop. How could you monetize it?",
    xpReward: 75,
    tier: "Foundation",
    level: 1,
    status: "not_started",
    timeEstimate: "8 min",
    icon: "🛠️",
    dnaCategory: "Initiative",
    questions: [
      { id: "q4_1", text: "What skill do you have or want to develop?" },
      { id: "q4_2", text: "How could you monetize this skill?" },
      { id: "q4_3", text: "Who would pay for this skill?" },
      { id: "q4_4", text: "How much could you charge?" },
    ],
  },
  {
    id: "mission_5",
    title: "Basic Money Awareness",
    description: "Track your spending for one day. Where does your money go?",
    xpReward: 75,
    tier: "Foundation",
    level: 1,
    status: "not_started",
    timeEstimate: "5 min",
    icon: "📊",
    dnaCategory: "Awareness",
    questions: [
      { id: "q5_1", text: "How much did you spend today?" },
      { id: "q5_2", text: "What did you spend money on?" },
      { id: "q5_3", text: "Was this spending necessary or optional?" },
      { id: "q5_4", text: "What could you have done differently?" },
    ],
  },

  // FOUNDATION TIER - Level 2+
  {
    id: "mission_6",
    title: "Create Your First Budget",
    description: "Build a simple budget for the next month. Allocate your income across categories.",
    xpReward: 150,
    tier: "Foundation",
    level: 2,
    status: "not_started",
    timeEstimate: "15 min",
    icon: "📋",
  },
  {
    id: "mission_7",
    title: "Explore Income Opportunities",
    description: "Research 3 ways you could earn money. List them with potential earnings.",
    xpReward: 125,
    tier: "Foundation",
    level: 2,
    status: "not_started",
    timeEstimate: "10 min",
    icon: "💵",
  },
  {
    id: "mission_8",
    title: "Learn About Investing",
    description: "Read about stocks, bonds, or ETFs. Understand the basics of investing.",
    xpReward: 150,
    tier: "Foundation",
    level: 3,
    status: "not_started",
    timeEstimate: "20 min",
    icon: "📈",
  },
  {
    id: "mission_9",
    title: "Understand Credit",
    description: "Learn about credit scores, credit cards, and how credit works.",
    xpReward: 150,
    tier: "Foundation",
    level: 3,
    status: "not_started",
    timeEstimate: "15 min",
    icon: "💳",
  },
  {
    id: "mission_10",
    title: "Build Your Emergency Fund",
    description: "Start saving for emergencies. Aim to save 1 week of expenses.",
    xpReward: 200,
    tier: "Foundation",
    level: 4,
    status: "not_started",
    timeEstimate: "10 min",
    icon: "🆘",
  },

  // BUILDER TIER
  {
    id: "mission_11",
    title: "Develop Your First Business Idea",
    description: "Brainstorm a product or service you could build. Write down the concept.",
    xpReward: 200,
    tier: "Builder",
    level: 11,
    status: "not_started",
    timeEstimate: "20 min",
    icon: "💡",
  },
  {
    id: "mission_12",
    title: "Research Your Market",
    description: "Identify your target customers. What problems do they have?",
    xpReward: 200,
    tier: "Builder",
    level: 11,
    status: "not_started",
    timeEstimate: "25 min",
    icon: "🔍",
  },
  {
    id: "mission_13",
    title: "Create Your MVP",
    description: "Build a simple version of your product. Get feedback from friends.",
    xpReward: 300,
    tier: "Builder",
    level: 12,
    status: "not_started",
    timeEstimate: "45 min",
    icon: "🚀",
  },
  {
    id: "mission_14",
    title: "Make Your First Sale",
    description: "Sell your product or service to someone. Document the experience.",
    xpReward: 300,
    tier: "Builder",
    level: 13,
    status: "not_started",
    timeEstimate: "30 min",
    icon: "🎉",
  },

  // OPERATOR TIER
  {
    id: "mission_15",
    title: "Scale Your Business",
    description: "Create a plan to reach 10x more customers. What's your growth strategy?",
    xpReward: 400,
    tier: "Operator",
    level: 26,
    status: "not_started",
    timeEstimate: "30 min",
    icon: "📡",
  },
  {
    id: "mission_16",
    title: "Build Your Team",
    description: "Recruit and train your first team member. Delegate a task.",
    xpReward: 400,
    tier: "Operator",
    level: 27,
    status: "not_started",
    timeEstimate: "45 min",
    icon: "👥",
  },
];

export function getMissions(tier?: "Foundation" | "Builder" | "Operator", level?: number): Mission[] {
  let filtered = MISSIONS;

  if (tier) {
    filtered = filtered.filter((m) => m.tier === tier);
  }

  if (level !== undefined) {
    filtered = filtered.filter((m) => m.level <= level);
  }

  return filtered;
}

export function getStarterMissions(): Mission[] {
  // Missions available immediately after onboarding (level 1)
  return MISSIONS.filter((m) => m.level === 1 && m.tier === "Foundation");
}

export function getMissionById(id: string): Mission | null {
  return MISSIONS.find((m) => m.id === id) || null;
}

export function getAvailableMissions(currentLevel: number): Mission[] {
  return MISSIONS.filter((m) => m.level <= currentLevel);
}
