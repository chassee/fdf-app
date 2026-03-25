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
