import { drizzle } from "drizzle-orm/mysql2";
import { missions, rewards } from "./drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("Seeding database...");

  // Seed missions for different year tracks
  const missionsData = [
    // Year 1 (Age 13) - Foundation
    {
      title: "Save $5 this week",
      description: "Put it in a jar or savings account.",
      yearTrack: 1,
      xpReward: 120,
      gemsReward: 10,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    {
      title: "Sell a product for $10",
      description: "Make your first sale online or in person.",
      yearTrack: 1,
      xpReward: 200,
      gemsReward: 15,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    {
      title: "Complete a logo design",
      description: "Design a logo for a friend or family member.",
      yearTrack: 1,
      xpReward: 250,
      gemsReward: 20,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    // Year 2 (Age 14) - Skills
    {
      title: "Build a simple website",
      description: "Create a landing page with HTML/CSS.",
      yearTrack: 2,
      xpReward: 300,
      gemsReward: 25,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    {
      title: "Learn 10 new coding terms",
      description: "Study programming vocabulary.",
      yearTrack: 2,
      xpReward: 150,
      gemsReward: 12,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    // Year 3 (Age 15-16) - Build
    {
      title: "Launch a side project",
      description: "Start your own business or creative project.",
      yearTrack: 3,
      xpReward: 500,
      gemsReward: 40,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    {
      title: "Earn $100 this month",
      description: "Make money from your skills.",
      yearTrack: 3,
      xpReward: 400,
      gemsReward: 35,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    // Year 4 (Age 17) - Vault Prep
    {
      title: "Build your portfolio",
      description: "Create a professional portfolio website.",
      yearTrack: 4,
      xpReward: 600,
      gemsReward: 50,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
    {
      title: "Network with 5 professionals",
      description: "Connect with people in your field.",
      yearTrack: 4,
      xpReward: 350,
      gemsReward: 30,
      weekStart: "2026-01-20",
      weekEnd: "2026-01-26",
      isActive: 1,
    },
  ];

  for (const mission of missionsData) {
    await db.insert(missions).values(mission);
  }

  console.log(`✅ Seeded ${missionsData.length} missions`);

  // Seed rewards
  const rewardsData = [
    {
      name: "Builder Badge",
      type: "badge",
      costGems: 200,
      rarity: "common",
      imageUrl: "/images/badge-builder.png",
    },
    {
      name: "Atlas Dawg NEW",
      type: "badge",
      costGems: 300,
      rarity: "rare",
      imageUrl: "/images/badge-atlas.png",
    },
    {
      name: "Genesis Sticker",
      type: "sticker",
      costGems: 350,
      rarity: "rare",
      imageUrl: "/images/sticker-genesis.png",
    },
    {
      name: "Neon Frame",
      type: "frame",
      costGems: 500,
      rarity: "legendary",
      imageUrl: "/images/frame-neon.png",
    },
    {
      name: "Cyber Frame",
      type: "frame",
      costGems: 450,
      rarity: "legendary",
      imageUrl: "/images/frame-cyber.png",
    },
  ];

  for (const reward of rewardsData) {
    await db.insert(rewards).values(reward);
  }

  console.log(`✅ Seeded ${rewardsData.length} rewards`);
  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
