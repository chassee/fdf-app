# Future Dawgs Foundation (FDF) — Full UI Redesign

## Design Philosophy
- Elite youth training system connected to Crypdawgs
- Apple internal tools + NASA dashboard + private academy system
- NOT a kids app, NOT playful, NOT gamified

## Core Visual Rules
- [x] No cartoon UI
- [x] No oversized mascots
- [x] No bright playful colors
- [x] No game-store or reward-shop feeling
- [x] No floating random elements

## Layout System
- [x] Structured grid layout
- [x] All sections inside grounded panels/cards
- [x] 24px minimum padding
- [x] 32px vertical rhythm between sections
- [x] Everything aligned, nothing floating

## Color System
- [x] Deep purple gradient background (dark → mid tone)
- [x] Glass panels (blur + low opacity dark overlay)
- [x] Subtle grid texture in background (very faint)
- [x] Remove flat lavender backgrounds

## Typography
- [x] Bold, tight, premium headlines (NOT rounded/bubbly)
- [x] Darker body text for authority
- [x] Clean, readable body
- [x] Minimal buttons with slight radius (NOT pill-shaped)

## Home Page
- [x] Hero: Left-aligned headline "Future Dawgs Foundation"
- [x] Hero subtext: "Start early. Build real financial intelligence. Enter the Vault prepared."
- [x] Buttons: [Apply for Access] and [Parent Information]
- [x] Very small mascot/abstract visual on right (not dominant)
- [x] Section 2: 3 glass panel cards (Daily Check-In, Missions, Progress Rank)
- [x] Section 3: Horizontal training path timeline (Entry → Training → Development → Vault Access)
- [x] Section 4: System status panel (Network: Online, Status: Active, Tier: FDF)

## Mascot Rules
- [x] Reduce size by 60%
- [x] Desaturate colors slightly
- [x] Add soft glow/outline
- [x] Only used as side support visual, never center focus
- [x] Max 1 mascot per section

## Missions / Progress UI
- [x] Replace game reward design with progress bars
- [x] Clean module cards
- [x] Locked/unlocked states (subtle)
- [x] No coins, no loot visuals, no playful icons

## Parents Page (/parents)
- [x] Institutional feel
- [x] Grid of cards with clean icons (NOT mascots)
- [x] Strong headers
- [x] Sections: What is FDF, Safety + Structure, Outcomes, Contact
- [x] Contact: admin@crypdawgs.com

## Application Flow
- [x] /apply page: minimal, serious form
- [x] After submit → redirect to /request-received
- [x] /request-received copy: "Application Received. All submissions are reviewed in batches. Selected applicants will be granted access into the system."

## Loading States
- [x] Skeleton loaders with soft shimmer
- [x] Glass cards
- [x] No playful animations

## Global Requirements
- [x] Remove ALL Manus branding
- [x] Mobile optimized
- [x] Smooth transitions (subtle)
- [x] Premium spacing + alignment
- [x] No clutter anywhere

## Tests
- [x] vitest: auth.logout test
- [x] vitest: fdf.getProfile tests (no profile, with profile)
- [x] vitest: fdf.getMissions test
- [x] vitest: fdf.getRewards test

## Full System Reset — Premium Youth Academy (Pasted_content_91)

### Navigation Fix (Critical)
- [x] Fix bottom nav — use Link from wouter, NOT div clicks
- [x] useLocation() for active tab highlighting
- [x] All 6 routes working: /, /ranks, /missions, /rewards, /graduation, /parents

### Theme Redesign (Light)
- [x] Replace dark background with soft white/blue gradient (#F7F9FF → #EEF3FF)
- [x] Glass cards: rgba(255,255,255,0.75) + backdrop-blur
- [x] Subtle grid texture in background
- [x] Soft shadows on all cards
- [x] Primary: #5B8CFF, Accent: #7B5CFF, Text: #0F172A

### Depth + 3D Feel
- [x] Floating soft shadows on cards
- [x] Gradient highlights on buttons
- [x] Subtle glow on active elements
- [x] Buttons: gradient + lift on hover

### Typography Hierarchy
- [x] Titles: bold, large, left-aligned
- [x] Subtext: smaller, #475569
- [x] 24px between sections, 16px inside cards

### Home Page Restructure
- [x] Hero card: Title + subtext + trust row (✔ Free ✔ Ages 13-17 ✔ Sponsor-Funded)
- [x] Apply for Access + Parent Information buttons
- [x] Card 1: Daily Check-In
- [x] Card 2: Missions
- [x] Card 3: Progress Rank
- [x] Card 4: Training Path

### Training Path
- [x] Entry → Training → Development → Vault Access
- [x] Circle indicators + age labels

### System Status Panel
- [x] Network: Online (green dot)
- [x] Status: Active (green dot)
- [x] Tier: FDF
- [x] Vault: Locked

### Parents Page
- [x] Increase contrast + spacing
- [x] Clear section breaks
- [x] Professional, safe, transparent feel

### Polish
- [x] Reduce mascot presence by 50%
- [x] No floating random elements
- [x] Everything inside structured cards
- [x] Mobile-first: no overflow, clean scroll on iPhone

## Missions Addiction Layer (Retention System)

### Daily Streak System
- [x] Streak tracker at top of Missions page (🔥 N Day Streak)
- [x] Horizontal 7-circle streak indicator (filled = completed days)
- [x] Soft glow on active/current day circle
- [x] Completing 1 mission/day maintains streak; missing resets it
- [x] Streak stored in fdf_progress table

### Mission Cards (Premium Card Design)
- [x] Each mission as glass card with icon, title, description
- [x] XP Reward (+50 XP) and Gem Reward (+10 💎) displayed
- [x] "Start Mission →" CTA button
- [x] Hover lift effect on cards
- [x] Gradient border glow when active/in-progress

### Progression Locking
- [x] Mission 1 unlocked by default
- [x] Mission 2+ locked until previous completed
- [x] Locked UI: slight blur + lock icon + "Complete previous mission" text
- [x] Unlock animation when previous mission completed

### XP Progression Bar (Top)
- [x] Level indicator (LEVEL 2)
- [x] XP: 120 / 300 with animated progress bar
- [x] Level-up animation when bar fills

### Completion Feedback Overlay
- [x] Full-screen overlay on mission complete: ✔ Mission Complete + XP + Gems
- [x] Scale + glow animation on overlay
- [x] "Continue" button to dismiss
- [x] Optimistic update to XP/Gems counters

### Category Structure
- [x] 💰 Money Basics section
- [x] 🧠 Mindset section
- [x] 🏗 Build & Create section
- [x] 🚀 Growth section
- [x] Each section collapsible

### Daily Activation Upgrade
- [x] Rename "Check In" to "Daily Activation"
- [x] Button: "Check In →"
- [x] Reward: +5 XP
- [x] Fast, satisfying micro-animation on activation

### Micro-animations (No Sound)
- [x] Glow pulse on active elements
- [x] Smooth card transitions
- [x] Progress bar fill animation
- [x] Completion overlay scale animation

## Rank System Upgrade (Premium Academy Status Layer)

### Rank Structure (4 Tiers)
- [x] Entry — "Welcome to the academy." — unlocked immediately
- [x] Training — "Build consistency and complete core missions." — 100 XP + 3 missions
- [x] Development — "Apply skills and show real progress." — 300 XP + 8 missions + 5-day streak
- [x] Vault Access — "Final readiness tier unlocked at 18." — age-gated, aspirational

### Current Rank Hero Card (Top of Page)
- [x] Large featured card: Current Rank Name + Status: Active
- [x] XP total + animated progress bar (gradient fill)
- [x] Missions completed count
- [x] Streak count
- [x] Next Rank target label

### Rank Timeline / Ladder
- [x] Vertical progression timeline with connecting rail
- [x] Each rank as premium card row: insignia + title + description + status chip
- [x] Completed ranks: softened with check icon
- [x] Active rank: highlighted with glow / stronger border
- [x] Locked ranks: muted, reduced opacity

### Visual Insignia System
- [x] Entry = clean circular badge (soft gradient)
- [x] Training = double-ring badge
- [x] Development = shield/star-mark badge
- [x] Vault Access = premium crest / elite insignia

### Rank Benefits / Unlocks
- [x] Entry: access to first missions
- [x] Training: advanced missions + streak tracking
- [x] Development: elite badge styling + milestone recognition + advanced curriculum
- [x] Vault Access: transition path to Crypdawgs Vault at 18

### XP + Requirements Logic
- [x] Real progression logic: read XP, missions, streak from backend
- [x] Show requirements on each rank card
- [x] Show "Next requirement to unlock" clearly

### Micro-animations
- [x] Progress bar fills smoothly
- [x] Active rank has soft glow pulse
- [x] Completed rank check fades in
- [x] Locked ranks remain still

### Deploy
- [x] Save checkpoint
- [ ] Publish site

## FDF Final System Lock

### Global Requirements
- [x] All 6 routes working: /, /ranks, /missions, /rewards, /graduation, /parents
- [x] Bottom navigation works on every screen with correct active tab highlighting
- [x] No dead buttons anywhere
- [x] Mobile-first layout (iPhone optimized, no overflow)
- [x] Consistent design system across all pages

### Global Design System Lock
- [x] Background: soft light gradient (white → light blue) + subtle grid texture
- [x] Cards: glass style, 16-20px radius, soft shadow, 20-24px padding
- [x] Text: strong dark headers, clean gray subtext, high contrast
- [x] Buttons: slight gradient, lift on tap, no flat buttons
- [x] 24px between sections, clean vertical rhythm
- [x] Remove all dark theme remnants, clutter, floating elements, oversized mascots

### Global State Context
- [x] Create FDFContext with XP, completed missions, streak, current rank
- [x] All pages read from and update this shared state
- [x] No hardcoded fake UI — everything updates based on real state

### Home Page Final State
- [x] Hero card: "Future Dawgs Foundation" + "Start early. Build real financial intelligence."
- [x] Trust line: ✔ 100% Free ✔ Ages 13–17 ✔ Sponsor-Funded
- [x] Apply for Access + Parent Information buttons
- [x] Daily Activation card (functional)
- [x] Missions preview card
- [x] Rank progress card
- [x] Training Path card

### Missions Page Final State
- [x] Daily Streak tracker at top (functional)
- [x] XP system (reads from global state)
- [x] Mission cards with title, description, XP reward, Start button
- [x] Locked/unlocked progression
- [x] Completion overlay with reward feedback
- [x] Updates XP + streak on completion

### Ranks Page Final State
- [x] Current Rank hero card with XP bar, missions, streak, next rank target
- [x] Rank progression ladder (Entry → Training → Development → Vault Access)
- [x] Dynamically updates based on user progress

### Rewards Page Final State
- [x] Clean structure: earned rewards + locked rewards (blurred)
- [x] Consistency Badge, 5 Day Streak Unlock, Mission Completion Milestone
- [x] No clutter, no fake complexity

### Graduation Page Final State
- [x] Aspirational feel: "Completion of FDF training"
- [x] Transition into next phase messaging
- [x] Vault access at 18 mention
- [x] Clean, minimal, premium

### Parents Page Final State
- [x] What FDF is, Why it exists, How it works, Safety + structure
- [x] Readable spacing, high contrast, no fluff
- [x] Trusted and clear institutional feel

### Final Polish
- [x] Remove all unused components
- [x] Remove console errors
- [x] Smooth scroll everywhere
- [x] Consistent spacing on all pages
- [x] No visual bugs

### Deploy
- [x] All 6 tests pass
- [x] TypeScript clean
- [x] Save checkpoint
- [ ] Publish site

## Live Progression Engine Upgrade

### User State System
- [x] Upgrade FDFContext to include full user state object (name, age, xp, level, rank, completed_missions, streak_days, vault_progress, unlocked_sections)
- [x] Persist state to localStorage (merge with backend on login)
- [x] Expose setters: addXP, completeMission, checkIn, setProfile

### Unlock Flow
- [x] Missions unlock immediately after sign-in
- [x] Rewards unlock at 100 XP
- [x] Ranks unlock at 250 XP
- [x] Vault unlock preview at 500 XP
- [x] Replace all static lock screens with dynamic unlock logic

### Missions System
- [x] Define real mission list (Save $10, Learn Credit, Track Spending, etc.)
- [x] Complete Mission button → adds XP → triggers animation
- [x] XP gain pop animation (+50 XP floating label)
- [x] Progress bar smooth fill animation
- [x] Completion state persisted to localStorage

### XP + Level + Rank System
- [x] Level formula: floor(xp / 100)
- [x] Rank tiers: Rookie (0-99), Starter (100-249), Builder (250-499), Operator (500-999), Elite (1000+)
- [x] Rank badge displayed on Home and Ranks pages
- [x] XP counter with animated increment

### Home Screen Upgrade
- [x] "Welcome back, [Name]" personalized header
- [x] Live XP bar + rank badge
- [x] "Continue Mission" primary CTA (links to next incomplete mission)
- [x] "Daily Streak: X days" display
- [x] Remove all placeholder/static content

### Micro-interactions
- [x] XP gain pop animation (+N XP floating label)
- [x] Progress bar smooth fill
- [x] Button press visual feedback (scale + glow)
- [x] Mission completion celebration overlay

### Remove Dead UI
- [x] Every button functional
- [x] Every tab navigates correctly
- [x] No placeholder text anywhere

### Tests + Deploy
- [x] Update vitest tests for new XP/rank/unlock logic
- [x] TypeScript clean
- [ ] Save checkpoint
- [ ] Publish site
