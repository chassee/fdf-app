# Future Dawgs Foundation (FDF) - TODO

## Core Features
- [ ] Implement Supabase Auth with Email OTP
- [x] Create database schema (fdf_users, fdf_progress, missions, mission_completions, rewards, user_rewards, sponsor_leads)
- [x] Implement age gating (under 13 blocked, 13-17 allowed, 18+ locked out)
- [x] Smart entry system based on age (Year 1-4 tracks)
- [x] Dawg Class selection during onboarding
- [x] Profile creation on first login
- [x] Mission claiming functionality with XP/Gems rewards
- [ ] Rank ladder system with automatic progression
- [ ] Daily streak check-in system
- [ ] 18+ lockout enforcement
- [x] Rewards unlock system using gems
- [ ] Sponsor lead form (/sponsors page)

## UI Polish
- [ ] Add smooth card shadows and glow gradients
- [ ] Premium button styling (inner glow + rounded corners + animations)
- [ ] Improve layout spacing
- [ ] Integrate mascots with themed containers + glow + floating effects
- [ ] Add status strip on Home (Rank, Streak, XP Progress)
- [ ] Make "This Week's Mission" interactive card
- [ ] Add floating particles/bubbles background effects

## Pages
- [x] Update Home page with auth state
- [x] Update Missions page with real data
- [x] Update Rewards page with unlock functionality
- [ ] Update Ranks page with progress tracking
- [ ] Update Graduation page with countdown and 18+ redirect
- [ ] Update Parents page
- [ ] Create Sponsors page with lead form

## Testing & Deployment
- [ ] Test age gate functionality
- [ ] Test Email OTP login
- [ ] Test mission claims update XP/Gems
- [ ] Test rewards unlock
- [ ] Test 18+ lockout
- [ ] Verify mobile iPhone layout
- [ ] Verify "Crypdawgs" spelling everywhere
- [ ] Deploy to Netlify at fdf.crypdawgs.com
