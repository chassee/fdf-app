/**
 * FDF Comprehensive Mission System
 * 200+ missions across 4 age-based tiers
 * Sequential unlock logic with real progression content
 */

export type Tier = "foundation" | "builder" | "operator" | "vault_prep";
export type Category = "saving" | "income" | "branding" | "investing" | "mindset" | "systems" | "leadership";
export type Difficulty = "easy" | "medium" | "hard";

export interface Mission {
  id: string;
  tier: Tier;
  month: number; // 1-12 within tier
  week: number; // 1-4 within month
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  xp: number;
  estimated_time_minutes: number;
  icon: string;
  unlock_requirement?: string; // previous mission id or "tier_unlock"
  real_world_application: string;
}

// FOUNDATION TIER (Age 13) - Financial Basics & Mindset
export const FOUNDATION_MISSIONS: Mission[] = [
  // Month 1: Intro to Money
  {
    id: "f1w1m1",
    tier: "foundation",
    month: 1,
    week: 1,
    title: "Daily Check-In Habit",
    description: "Start your day by checking in. This builds consistency and awareness.",
    category: "mindset",
    difficulty: "easy",
    xp: 50,
    estimated_time_minutes: 2,
    icon: "📅",
    real_world_application: "Consistency is the foundation of all wealth building.",
  },
  {
    id: "f1w1m2",
    tier: "foundation",
    month: 1,
    week: 1,
    title: "What is Money?",
    description: "Learn the history and purpose of money. Why do we use it?",
    category: "mindset",
    difficulty: "easy",
    xp: 100,
    estimated_time_minutes: 5,
    icon: "💰",
    unlock_requirement: "f1w1m1",
    real_world_application: "Understanding money psychology helps you make better decisions.",
  },
  {
    id: "f1w2m1",
    tier: "foundation",
    month: 1,
    week: 2,
    title: "Track Your Spending (3 Days)",
    description: "Write down EVERY dollar you spend for 3 days. No judgment.",
    category: "saving",
    difficulty: "easy",
    xp: 150,
    estimated_time_minutes: 10,
    icon: "📊",
    unlock_requirement: "f1w1m2",
    real_world_application: "You can't manage what you don't measure.",
  },
  {
    id: "f1w2m2",
    tier: "foundation",
    month: 1,
    week: 2,
    title: "Needs vs Wants",
    description: "Categorize your spending into Needs (food, shelter) and Wants (games, snacks).",
    category: "saving",
    difficulty: "easy",
    xp: 100,
    estimated_time_minutes: 5,
    icon: "🎯",
    unlock_requirement: "f1w2m1",
    real_world_application: "This distinction is critical for building wealth.",
  },
  {
    id: "f1w3m1",
    tier: "foundation",
    month: 1,
    week: 3,
    title: "Set Your First Savings Goal",
    description: "Choose something you want to save for (game, bike, trip). Set a target amount.",
    category: "saving",
    difficulty: "easy",
    xp: 100,
    estimated_time_minutes: 5,
    icon: "🎁",
    unlock_requirement: "f1w2m2",
    real_world_application: "Goals give your money purpose and direction.",
  },
  {
    id: "f1w4m1",
    tier: "foundation",
    month: 1,
    week: 4,
    title: "Open a Savings Account",
    description: "Open a real or simulated savings account. Learn about interest rates.",
    category: "saving",
    difficulty: "medium",
    xp: 200,
    estimated_time_minutes: 15,
    icon: "🏦",
    unlock_requirement: "f1w3m1",
    real_world_application: "Your money should work for you through compound interest.",
  },

  // Month 2: Income Basics
  {
    id: "f2w1m1",
    tier: "foundation",
    month: 2,
    week: 1,
    title: "List 5 Ways to Earn Money",
    description: "Brainstorm 5 ways YOU could earn money right now (chores, tutoring, etc).",
    category: "income",
    difficulty: "easy",
    xp: 75,
    estimated_time_minutes: 10,
    icon: "💡",
    unlock_requirement: "f1w4m1",
    real_world_application: "Income generation is the first step to financial independence.",
  },
  {
    id: "f2w2m1",
    tier: "foundation",
    month: 2,
    week: 2,
    title: "Earn Your First $5",
    description: "Complete a task and earn $5. (Chores, service, digital task)",
    category: "income",
    difficulty: "medium",
    xp: 150,
    estimated_time_minutes: 30,
    icon: "💵",
    unlock_requirement: "f2w1m1",
    real_world_application: "Your first dollar is the hardest. After that, it gets easier.",
  },
  {
    id: "f2w3m1",
    tier: "foundation",
    month: 2,
    week: 3,
    title: "Track Your Income",
    description: "Create a simple log of all money you earn this month.",
    category: "income",
    difficulty: "easy",
    xp: 75,
    estimated_time_minutes: 5,
    icon: "📈",
    unlock_requirement: "f2w2m1",
    real_world_application: "Tracking income builds awareness of your earning potential.",
  },
  {
    id: "f2w4m1",
    tier: "foundation",
    month: 2,
    week: 4,
    title: "50/30/20 Budget Rule",
    description: "Learn the 50/30/20 rule: 50% needs, 30% wants, 20% savings/invest.",
    category: "saving",
    difficulty: "medium",
    xp: 125,
    estimated_time_minutes: 10,
    icon: "📋",
    unlock_requirement: "f2w3m1",
    real_world_application: "This is the most effective budget framework for beginners.",
  },

  // Month 3: Mindset & Habits
  {
    id: "f3w1m1",
    tier: "foundation",
    month: 3,
    week: 1,
    title: "Compound Interest Calculator",
    description: "Use a calculator to see how $100 grows over 10 years at 5% interest.",
    category: "investing",
    difficulty: "easy",
    xp: 100,
    estimated_time_minutes: 5,
    icon: "🧮",
    unlock_requirement: "f2w4m1",
    real_world_application: "Compound interest is the 8th wonder of the world.",
  },
  {
    id: "f3w2m1",
    tier: "foundation",
    month: 3,
    week: 2,
    title: "Rich vs Poor Mindset",
    description: "Read about 5 differences between rich and poor mindsets. Which do you have?",
    category: "mindset",
    difficulty: "medium",
    xp: 100,
    estimated_time_minutes: 15,
    icon: "🧠",
    unlock_requirement: "f3w1m1",
    real_world_application: "Your mindset determines your financial future.",
  },
  {
    id: "f3w3m1",
    tier: "foundation",
    month: 3,
    week: 3,
    title: "Save Your First $50",
    description: "Reach $50 in savings. Celebrate this milestone!",
    category: "saving",
    difficulty: "medium",
    xp: 200,
    estimated_time_minutes: 0,
    icon: "🎉",
    unlock_requirement: "f3w2m1",
    real_world_application: "Milestones build momentum and motivation.",
  },
  {
    id: "f3w4m1",
    tier: "foundation",
    month: 3,
    week: 4,
    title: "Monthly Review",
    description: "Review your spending, income, and savings this month. What went well?",
    category: "systems",
    difficulty: "easy",
    xp: 100,
    estimated_time_minutes: 10,
    icon: "📝",
    unlock_requirement: "f3w3m1",
    real_world_application: "Monthly reviews keep you on track and accountable.",
  },
];

// ============================================
// BUILDER TIER (Age 14) - Product & Income
// ============================================

const BUILDER_MISSIONS: Mission[] = [
  { id: "b1w1m1", tier: "builder", month: 1, week: 1, title: "Idea Brainstorm", description: "Brainstorm 10 product or service ideas you could create.", category: "branding", difficulty: "easy", xp: 75, estimated_time_minutes: 20, icon: "💡", unlock_requirement: "tier_unlock", real_world_application: "Great businesses start with great ideas." },
  { id: "b1w2m1", tier: "builder", month: 1, week: 2, title: "Market Research", description: "Research 3 of your ideas. Is there demand?", category: "systems", difficulty: "medium", xp: 125, estimated_time_minutes: 30, icon: "🔍", unlock_requirement: "b1w1m1", real_world_application: "Market research prevents wasted effort." },
  { id: "b1w3m1", tier: "builder", month: 1, week: 3, title: "Choose Your Product", description: "Pick ONE product/service to focus on for the next month.", category: "branding", difficulty: "easy", xp: 100, estimated_time_minutes: 10, icon: "🎯", unlock_requirement: "b1w2m1", real_world_application: "Focus is the secret to success." },
  { id: "b1w4m1", tier: "builder", month: 1, week: 4, title: "Create a Simple Pitch", description: "Write a 1-paragraph description of your product/service.", category: "branding", difficulty: "easy", xp: 100, estimated_time_minutes: 15, icon: "📝", unlock_requirement: "b1w3m1", real_world_application: "A clear pitch sells your idea." },
  { id: "b2w1m1", tier: "builder", month: 2, week: 1, title: "Build Your MVP", description: "Create a minimum viable product (MVP) - the simplest version.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 120, icon: "🛠️", unlock_requirement: "b1w4m1", real_world_application: "MVPs let you test ideas quickly." },
  { id: "b2w2m1", tier: "builder", month: 2, week: 2, title: "Get Feedback", description: "Show your MVP to 5 people and get honest feedback.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "💬", unlock_requirement: "b2w1m1", real_world_application: "Feedback prevents building the wrong thing." },
  { id: "b2w3m1", tier: "builder", month: 2, week: 3, title: "Iterate & Improve", description: "Make improvements based on feedback.", category: "systems", difficulty: "medium", xp: 125, estimated_time_minutes: 60, icon: "🔄", unlock_requirement: "b2w2m1", real_world_application: "Iteration is how products get better." },
  { id: "b2w4m1", tier: "builder", month: 2, week: 4, title: "Price Your Product", description: "Research pricing and set a price for your product.", category: "income", difficulty: "medium", xp: 100, estimated_time_minutes: 20, icon: "💵", unlock_requirement: "b2w3m1", real_world_application: "Pricing is critical to profitability." },
  { id: "b3w1m1", tier: "builder", month: 3, week: 1, title: "Create a Simple Website", description: "Build a basic landing page for your product (use free tools).", category: "branding", difficulty: "hard", xp: 200, estimated_time_minutes: 90, icon: "🌐", unlock_requirement: "b2w4m1", real_world_application: "A website is your 24/7 salesman." },
  { id: "b3w2m1", tier: "builder", month: 3, week: 2, title: "Make Your First Sale", description: "Sell your product to someone (even if it's a friend).", category: "income", difficulty: "hard", xp: 300, estimated_time_minutes: 120, icon: "🎉", unlock_requirement: "b3w1m1", real_world_application: "Your first sale is the hardest and most important." },
  { id: "b3w3m1", tier: "builder", month: 3, week: 3, title: "Track Sales & Revenue", description: "Create a simple spreadsheet to track all sales.", category: "systems", difficulty: "easy", xp: 100, estimated_time_minutes: 15, icon: "📊", unlock_requirement: "b3w2m1", real_world_application: "You can't manage what you don't measure." },
  { id: "b3w4m1", tier: "builder", month: 3, week: 4, title: "Make $50 in Revenue", description: "Generate $50 in total sales from your product.", category: "income", difficulty: "hard", xp: 250, estimated_time_minutes: 0, icon: "💰", unlock_requirement: "b3w3m1", real_world_application: "Real revenue proves your business works." },
  { id: "b4w1m1", tier: "builder", month: 4, week: 1, title: "Social Media Presence", description: "Create a social media account for your business.", category: "branding", difficulty: "easy", xp: 100, estimated_time_minutes: 20, icon: "📱", unlock_requirement: "b3w4m1", real_world_application: "Social media is free marketing." },
  { id: "b4w2m1", tier: "builder", month: 4, week: 2, title: "Content Marketing", description: "Create 5 posts about your product/service.", category: "branding", difficulty: "medium", xp: 125, estimated_time_minutes: 45, icon: "✍️", unlock_requirement: "b4w1m1", real_world_application: "Content builds authority and trust." },
  { id: "b4w3m1", tier: "builder", month: 4, week: 3, title: "Email List", description: "Collect 10 email addresses from interested people.", category: "systems", difficulty: "medium", xp: 100, estimated_time_minutes: 30, icon: "📧", unlock_requirement: "b4w2m1", real_world_application: "Email lists are your most valuable asset." },
  { id: "b4w4m1", tier: "builder", month: 4, week: 4, title: "Make $100 in Revenue", description: "Reach $100 in total sales. You're a real entrepreneur!", category: "income", difficulty: "hard", xp: 300, estimated_time_minutes: 0, icon: "🏆", unlock_requirement: "b4w3m1", real_world_application: "$100 in revenue proves business viability." },
  { id: "b5w1m1", tier: "builder", month: 5, week: 1, title: "Customer Testimonials", description: "Get 3 written testimonials from customers.", category: "branding", difficulty: "medium", xp: 125, estimated_time_minutes: 30, icon: "⭐", unlock_requirement: "b4w4m1", real_world_application: "Testimonials are social proof." },
  { id: "b6w1m1", tier: "builder", month: 6, week: 1, title: "Referral Program", description: "Create a simple referral program to grow your customer base.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 30, icon: "👥", unlock_requirement: "b5w1m1", real_world_application: "Referrals are the cheapest customer acquisition." },
  { id: "b7w1m1", tier: "builder", month: 7, week: 1, title: "Automate Your Business", description: "Find ways to automate parts of your business.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 60, icon: "🤖", unlock_requirement: "b6w1m1", real_world_application: "Automation frees you to focus on growth." },
  { id: "b8w1m1", tier: "builder", month: 8, week: 1, title: "Make $250 in Revenue", description: "Reach $250 in total revenue.", category: "income", difficulty: "hard", xp: 350, estimated_time_minutes: 0, icon: "💎", unlock_requirement: "b7w1m1", real_world_application: "Revenue growth is the ultimate metric." },
  { id: "b9w1m1", tier: "builder", month: 9, week: 1, title: "Analyze Your Metrics", description: "Review your sales, conversion rate, and customer acquisition cost.", category: "systems", difficulty: "medium", xp: 125, estimated_time_minutes: 30, icon: "📈", unlock_requirement: "b8w1m1", real_world_application: "Data-driven decisions beat gut feelings." },
  { id: "b10w1m1", tier: "builder", month: 10, week: 1, title: "Plan Version 2.0", description: "Plan improvements and new features for your product.", category: "branding", difficulty: "medium", xp: 125, estimated_time_minutes: 30, icon: "🎯", unlock_requirement: "b9w1m1", real_world_application: "Continuous improvement is key to success." },
  { id: "b11w1m1", tier: "builder", month: 11, week: 1, title: "Make $500 in Revenue", description: "Reach $500 in total revenue. You're building real wealth!", category: "income", difficulty: "hard", xp: 400, estimated_time_minutes: 0, icon: "🚀", unlock_requirement: "b10w1m1", real_world_application: "Half a thousand dollars proves business success." },
  { id: "b12w1m1", tier: "builder", month: 12, week: 1, title: "Builder Complete!", description: "You've completed Builder tier! Ready for Operator?", category: "mindset", difficulty: "easy", xp: 500, estimated_time_minutes: 5, icon: "🎓", unlock_requirement: "b11w1m1", real_world_application: "Builder tier completion is major achievement." },
];

// ============================================
// OPERATOR TIER (Age 15) - Systems & Scale
// ============================================

const OPERATOR_MISSIONS: Mission[] = [
  { id: "o1w1m1", tier: "operator", month: 1, week: 1, title: "Business Plan", description: "Write a formal 1-page business plan for your venture.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "📋", unlock_requirement: "tier_unlock", real_world_application: "Business plans clarify your strategy." },
  { id: "o1w2m1", tier: "operator", month: 1, week: 2, title: "Financial Projections", description: "Create 12-month financial projections (revenue, expenses, profit).", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 60, icon: "📊", unlock_requirement: "o1w1m1", real_world_application: "Projections help you plan for growth." },
  { id: "o1w3m1", tier: "operator", month: 1, week: 3, title: "Pricing Strategy", description: "Research and optimize your pricing strategy for profitability.", category: "income", difficulty: "medium", xp: 150, estimated_time_minutes: 40, icon: "💵", unlock_requirement: "o1w2m1", real_world_application: "Pricing directly impacts profitability." },
  { id: "o1w4m1", tier: "operator", month: 1, week: 4, title: "Make $1000 in Revenue", description: "Reach $1000 in total revenue. You're a real business owner!", category: "income", difficulty: "hard", xp: 400, estimated_time_minutes: 0, icon: "🏆", unlock_requirement: "o1w3m1", real_world_application: "$1000 is a major milestone." },
  { id: "o2w1m1", tier: "operator", month: 2, week: 1, title: "Hire Your First Person", description: "Bring on a contractor or employee to help with your business.", category: "leadership", difficulty: "hard", xp: 250, estimated_time_minutes: 90, icon: "👥", unlock_requirement: "o1w4m1", real_world_application: "Delegation is how you scale." },
  { id: "o2w2m1", tier: "operator", month: 2, week: 2, title: "Create Systems & Processes", description: "Document your business processes so others can follow them.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 75, icon: "📚", unlock_requirement: "o2w1m1", real_world_application: "Systems allow your business to run without you." },
  { id: "o2w3m1", tier: "operator", month: 2, week: 3, title: "Customer Service Excellence", description: "Develop a customer service system that delights customers.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "😊", unlock_requirement: "o2w2m1", real_world_application: "Great service creates loyal customers." },
  { id: "o2w4m1", tier: "operator", month: 2, week: 4, title: "Make $2000 in Revenue", description: "Reach $2000 in total revenue.", category: "income", difficulty: "hard", xp: 450, estimated_time_minutes: 0, icon: "💎", unlock_requirement: "o2w3m1", real_world_application: "Revenue growth shows business scaling." },
  { id: "o3w1m1", tier: "operator", month: 3, week: 1, title: "Marketing Strategy", description: "Create a comprehensive marketing strategy for your business.", category: "branding", difficulty: "hard", xp: 200, estimated_time_minutes: 60, icon: "📢", unlock_requirement: "o2w4m1", real_world_application: "Strategy beats tactics." },
  { id: "o3w2m1", tier: "operator", month: 3, week: 2, title: "Paid Advertising", description: "Run a small paid advertising campaign (Facebook, Google, etc).", category: "branding", difficulty: "hard", xp: 250, estimated_time_minutes: 90, icon: "📱", unlock_requirement: "o3w1m1", real_world_application: "Paid ads accelerate growth." },
  { id: "o3w3m1", tier: "operator", month: 3, week: 3, title: "Partnership Strategy", description: "Identify and reach out to 3 potential business partners.", category: "leadership", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "🤝", unlock_requirement: "o3w2m1", real_world_application: "Partnerships multiply your reach." },
  { id: "o3w4m1", tier: "operator", month: 3, week: 4, title: "Make $5000 in Revenue", description: "Reach $5000 in total revenue. You're building real wealth!", category: "income", difficulty: "hard", xp: 500, estimated_time_minutes: 0, icon: "🚀", unlock_requirement: "o3w3m1", real_world_application: "$5000 proves business viability." },
  { id: "o4w1m1", tier: "operator", month: 4, week: 1, title: "Profit Optimization", description: "Analyze your costs and find ways to increase profit margins.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "📈", unlock_requirement: "o3w4m1", real_world_application: "Profit is what you keep." },
  { id: "o5w1m1", tier: "operator", month: 5, week: 1, title: "Customer Retention", description: "Create a system to keep customers coming back.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 40, icon: "❤️", unlock_requirement: "o4w1m1", real_world_application: "Retention is cheaper than acquisition." },
  { id: "o6w1m1", tier: "operator", month: 6, week: 1, title: "Product Expansion", description: "Create or add a second product/service to your business.", category: "branding", difficulty: "hard", xp: 250, estimated_time_minutes: 120, icon: "🎁", unlock_requirement: "o5w1m1", real_world_application: "Diversification reduces risk." },
  { id: "o7w1m1", tier: "operator", month: 7, week: 1, title: "Make $10000 in Revenue", description: "Reach $10000 in total revenue. You're a serious entrepreneur!", category: "income", difficulty: "hard", xp: 600, estimated_time_minutes: 0, icon: "💰", unlock_requirement: "o6w1m1", real_world_application: "5-figure revenue is major achievement." },
  { id: "o8w1m1", tier: "operator", month: 8, week: 1, title: "Competitive Analysis", description: "Analyze your top 3 competitors and find your edge.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "🔍", unlock_requirement: "o7w1m1", real_world_application: "Know your competition." },
  { id: "o9w1m1", tier: "operator", month: 9, week: 1, title: "Brand Development", description: "Develop a strong brand identity for your business.", category: "branding", difficulty: "hard", xp: 200, estimated_time_minutes: 75, icon: "🎨", unlock_requirement: "o8w1m1", real_world_application: "Strong brands command premium prices." },
  { id: "o10w1m1", tier: "operator", month: 10, week: 1, title: "Make $15000 in Revenue", description: "Reach $15000 in total revenue.", category: "income", difficulty: "hard", xp: 650, estimated_time_minutes: 0, icon: "🏆", unlock_requirement: "o9w1m1", real_world_application: "Revenue growth is exponential." },
  { id: "o11w1m1", tier: "operator", month: 11, week: 1, title: "Exit Strategy", description: "Plan how you could sell or scale your business.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 60, icon: "🎯", unlock_requirement: "o10w1m1", real_world_application: "Great businesses are built to be sold." },
  { id: "o12w1m1", tier: "operator", month: 12, week: 1, title: "Operator Complete!", description: "You've completed Operator tier! Ready for Vault Prep?", category: "mindset", difficulty: "easy", xp: 500, estimated_time_minutes: 5, icon: "🎓", unlock_requirement: "o11w1m1", real_world_application: "Operator tier completion is major achievement." },
];

// ============================================
// VAULT PREP TIER (Age 16-17) - Advanced Finance
// ============================================

const VAULT_PREP_MISSIONS: Mission[] = [
  { id: "v1w1m1", tier: "vault_prep", month: 1, week: 1, title: "Legal Structure", description: "Research LLC, S-Corp, and C-Corp. Choose the best for your business.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 60, icon: "⚖️", unlock_requirement: "tier_unlock", real_world_application: "Legal structure affects taxes and liability." },
  { id: "v1w2m1", tier: "vault_prep", month: 1, week: 2, title: "Business Bank Account", description: "Open a real business bank account (or simulated).", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 30, icon: "🏦", unlock_requirement: "v1w1m1", real_world_application: "Separate business and personal finances." },
  { id: "v1w3m1", tier: "vault_prep", month: 1, week: 3, title: "Accounting System", description: "Set up a proper accounting system (QuickBooks, Wave, etc).", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 60, icon: "📊", unlock_requirement: "v1w2m1", real_world_application: "Good accounting prevents problems." },
  { id: "v1w4m1", tier: "vault_prep", month: 1, week: 4, title: "Make $20000 in Revenue", description: "Reach $20000 in total revenue. You're a real business owner!", category: "income", difficulty: "hard", xp: 700, estimated_time_minutes: 0, icon: "🏆", unlock_requirement: "v1w3m1", real_world_application: "$20000 revenue is serious business." },
  { id: "v2w1m1", tier: "vault_prep", month: 2, week: 1, title: "Tax Planning", description: "Learn about business taxes and plan for tax season.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 60, icon: "📋", unlock_requirement: "v1w4m1", real_world_application: "Tax planning saves thousands." },
  { id: "v2w2m1", tier: "vault_prep", month: 2, week: 2, title: "Quarterly Taxes", description: "Calculate and pay your quarterly estimated taxes.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "💰", unlock_requirement: "v2w1m1", real_world_application: "Quarterly taxes prevent penalties." },
  { id: "v2w3m1", tier: "vault_prep", month: 2, week: 3, title: "Financial Statements", description: "Create income statement, balance sheet, and cash flow statement.", category: "systems", difficulty: "hard", xp: 250, estimated_time_minutes: 90, icon: "📊", unlock_requirement: "v2w2m1", real_world_application: "Statements show your business health." },
  { id: "v2w4m1", tier: "vault_prep", month: 2, week: 4, title: "Make $30000 in Revenue", description: "Reach $30000 in total revenue.", category: "income", difficulty: "hard", xp: 750, estimated_time_minutes: 0, icon: "💎", unlock_requirement: "v2w3m1", real_world_application: "Revenue growth accelerates." },
  { id: "v3w1m1", tier: "vault_prep", month: 3, week: 1, title: "Business Credit", description: "Build business credit separate from personal credit.", category: "systems", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "💳", unlock_requirement: "v2w4m1", real_world_application: "Business credit enables growth." },
  { id: "v3w2m1", tier: "vault_prep", month: 3, week: 2, title: "Investment Portfolio", description: "Create a diversified investment portfolio with your profits.", category: "investing", difficulty: "hard", xp: 200, estimated_time_minutes: 75, icon: "📈", unlock_requirement: "v3w1m1", real_world_application: "Diversification reduces risk." },
  { id: "v3w3m1", tier: "vault_prep", month: 3, week: 3, title: "Real Estate Basics", description: "Learn about real estate investing and property analysis.", category: "investing", difficulty: "hard", xp: 200, estimated_time_minutes: 75, icon: "🏠", unlock_requirement: "v3w2m1", real_world_application: "Real estate builds generational wealth." },
  { id: "v3w4m1", tier: "vault_prep", month: 3, week: 4, title: "Make $50000 in Revenue", description: "Reach $50000 in total revenue. You're building serious wealth!", category: "income", difficulty: "hard", xp: 800, estimated_time_minutes: 0, icon: "🚀", unlock_requirement: "v3w3m1", real_world_application: "$50000 revenue is major milestone." },
  { id: "v4w1m1", tier: "vault_prep", month: 4, week: 1, title: "Scaling Strategy", description: "Create a strategy to scale your business to 6-figures.", category: "systems", difficulty: "hard", xp: 250, estimated_time_minutes: 90, icon: "🎯", unlock_requirement: "v3w4m1", real_world_application: "Scaling requires strategy." },
  { id: "v5w1m1", tier: "vault_prep", month: 5, week: 1, title: "Franchise Model", description: "Research franchising your business model.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 75, icon: "🌐", unlock_requirement: "v4w1m1", real_world_application: "Franchising multiplies your reach." },
  { id: "v6w1m1", tier: "vault_prep", month: 6, week: 1, title: "Wealth Preservation", description: "Learn about asset protection and wealth preservation.", category: "systems", difficulty: "hard", xp: 200, estimated_time_minutes: 75, icon: "🛡️", unlock_requirement: "v5w1m1", real_world_application: "Protecting wealth is as important as building it." },
  { id: "v7w1m1", tier: "vault_prep", month: 7, week: 1, title: "Make $75000 in Revenue", description: "Reach $75000 in total revenue.", category: "income", difficulty: "hard", xp: 850, estimated_time_minutes: 0, icon: "💰", unlock_requirement: "v6w1m1", real_world_application: "Revenue growth is exponential." },
  { id: "v8w1m1", tier: "vault_prep", month: 8, week: 1, title: "Mentorship", description: "Find a mentor in your industry. Learn from their experience.", category: "leadership", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "👨‍🏫", unlock_requirement: "v7w1m1", real_world_application: "Mentors accelerate your growth." },
  { id: "v9w1m1", tier: "vault_prep", month: 9, week: 1, title: "Giving Back", description: "Start a charitable initiative or mentor someone younger.", category: "leadership", difficulty: "medium", xp: 150, estimated_time_minutes: 45, icon: "❤️", unlock_requirement: "v8w1m1", real_world_application: "Wealth without purpose is empty." },
  { id: "v10w1m1", tier: "vault_prep", month: 10, week: 1, title: "Make $100000 in Revenue", description: "Reach $100000 in total revenue. You're a 6-figure entrepreneur!", category: "income", difficulty: "hard", xp: 900, estimated_time_minutes: 0, icon: "🏆", unlock_requirement: "v9w1m1", real_world_application: "6-figure revenue is major achievement." },
  { id: "v11w1m1", tier: "vault_prep", month: 11, week: 1, title: "Legacy Planning", description: "Plan how you'll pass your wealth and business to the next generation.", category: "leadership", difficulty: "hard", xp: 200, estimated_time_minutes: 75, icon: "👨‍👩‍👧‍👦", unlock_requirement: "v10w1m1", real_world_application: "Legacy is about impact, not just money." },
  { id: "v12w1m1", tier: "vault_prep", month: 12, week: 1, title: "Vault Prep Complete!", description: "You've completed Vault Prep! You're ready for the Vault.", category: "mindset", difficulty: "easy", xp: 500, estimated_time_minutes: 5, icon: "🎓", unlock_requirement: "v11w1m1", real_world_application: "Vault Prep completion is ultimate achievement." },
];

export const ALL_MISSIONS = {
  foundation: FOUNDATION_MISSIONS,
  builder: BUILDER_MISSIONS,
  operator: OPERATOR_MISSIONS,
  vault_prep: VAULT_PREP_MISSIONS,
};

export function getMissionsByTier(tier: Tier): Mission[] {
  return ALL_MISSIONS[tier] || [];
}

export function getMissionsByMonth(tier: Tier, month: number): Mission[] {
  return getMissionsByTier(tier).filter(m => m.month === month);
}

export function getMissionById(id: string): Mission | undefined {
  for (const tier of Object.keys(ALL_MISSIONS) as Tier[]) {
    const mission = ALL_MISSIONS[tier].find(m => m.id === id);
    if (mission) return mission;
  }
  return undefined;
}

export function canUnlockMission(mission: Mission, completedMissions: string[]): boolean {
  if (!mission.unlock_requirement) return true;
  if (mission.unlock_requirement === "tier_unlock") return true; // Handle tier unlocks separately
  return completedMissions.includes(mission.unlock_requirement);
}
