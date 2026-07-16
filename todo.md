# FDF Vault Upgrade - Production Implementation Checklist

## PHASE 0: ✅ COMPLETE
- [x] Supabase schema deployed (profiles, user_state, mission_definitions, mission_responses, dna_events, goals, daily_checkins)
- [x] Canonical progression module created (lib/progression.ts)
- [x] Home page updated to use canonical state
- [x] Missions page updated to use canonical state
- [x] Ranks page updated to use canonical state
- [x] Rewards page updated to use canonical state

## PHASE 1: ✅ COMPLETE
- [x] Fixed Home progress bar (shows real XP-into-level)
- [x] Fixed Missions unlock progress display
- [x] Fixed Ranks/Leaderboard to read from user_state
- [x] Fixed Rewards page unlock gates
- [x] All screens display identical progression values

## PHASE 2: ✅ COMPLETE - Data-Driven Mission Inputs
- [x] Create activity_schema structure for missions
- [x] Update mission_definitions table with activity_schema
- [x] Create MissionActivity component for rendering inputs
- [x] Update MissionDetail page to use activity_schema
- [x] Implement answer validation
- [x] Persist mission_responses to database
- [x] Test mission completion with answers
- [x] Verify XP award on completion
- [x] Test page refresh persistence
- [x] Commit Phase 2 to GitHub (32a1b6c9)

## PHASE 3: Daily Check-In Anti-Farm System
- [ ] Create daily_checkins table schema
- [ ] Implement check-in logic (one per day)
- [ ] Add anti-farm protection (time-based, IP-based)
- [ ] Implement streak calculation
- [ ] Create Daily Check-In page UI
- [ ] Add streak display to Home page
- [ ] Test streak persistence
- [ ] Test anti-farm blocking
- [ ] Verify database writes
- [ ] Commit Phase 3 to GitHub

## PHASE 4: DNA Scoring Event System
- [ ] Create dna_events table schema
- [ ] Implement DNA category tracking
- [ ] Create DNA scoring formula
- [ ] Update mission completion to record DNA events
- [ ] Create DNA page UI
- [ ] Display DNA growth over time
- [ ] Test DNA calculations
- [ ] Verify event persistence
- [ ] Test leaderboard with DNA scores
- [ ] Commit Phase 4 to GitHub

## PHASE 5: Progress Journal / My Journey
- [ ] Create Progress Journal page
- [ ] Display completed missions with answers
- [ ] Show XP growth timeline
- [ ] Show level progression history
- [ ] Show DNA trait growth
- [ ] Show goals and achievements
- [ ] Create Graduation Report page
- [ ] Add graduation eligibility check
- [ ] Test timeline rendering
- [ ] Verify data accuracy
- [ ] Commit Phase 5 to GitHub

## QA CHECKLIST (Before Each Phase Deployment)
- [ ] Test brand-new user account creation
- [ ] Test complete onboarding flow
- [ ] Test login/logout
- [ ] Test page refresh persistence
- [ ] Test XP calculations accuracy
- [ ] Test level progression formula
- [ ] Test mission completion workflow
- [ ] Test rewards unlocking at correct levels
- [ ] Test leaderboard updates
- [ ] Test streak calculations
- [ ] Test database writes and reads
- [ ] Verify all screens show identical values
- [ ] Test on mobile (responsive)
- [ ] Test on desktop
- [ ] Check for console errors
- [ ] Verify no regressions from previous phases

## FINAL DEPLOYMENT
- [ ] Complete QA pass of entire application
- [ ] Fix all discovered bugs
- [ ] Build production version
- [ ] Push to GitHub master
- [ ] Verify Netlify deployment
- [ ] Provide deployment URL
- [ ] Provide GitHub commit hash
- [ ] Document architectural changes
- [ ] Document all bugs fixed
- [ ] List remaining known issues
- [ ] Recommend Phase 6 priorities
