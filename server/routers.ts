import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  fdf: router({
    // Get or create FDF profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const fdfUser = await db.getFdfUserByUserId(ctx.user.id);
      const progress = await db.getFdfProgress(ctx.user.id);
      
      return {
        fdfUser,
        progress,
        baseUser: ctx.user,
      };
    }),

    // Complete onboarding
    completeOnboarding: protectedProcedure
      .input(
        z.object({
          dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
          country: z.string().optional(),
          dawgClass: z.enum(["builder", "creator", "tech", "money"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Check if already exists
        const existing = await db.getFdfUserByUserId(ctx.user.id);
        if (existing) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Profile already exists",
          });
        }

        // Calculate age and year track
        const age = db.calculateAge(input.dob);
        
        // Age gating
        if (age < 13) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "FDF is for ages 13-17 only",
          });
        }
        if (age >= 18) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You've graduated! Please visit the Vault.",
          });
        }

        // Determine year track based on age
        let yearTrack = 1;
        if (age === 13) yearTrack = 1;
        else if (age === 14) yearTrack = 2;
        else if (age === 15 || age === 16) yearTrack = 3;
        else if (age === 17) yearTrack = 4;

        // Create FDF user
        await db.createFdfUser({
          userId: ctx.user.id,
          displayName: ctx.user.name || undefined,
          dob: input.dob,
          country: input.country,
          dawgClass: input.dawgClass,
          yearTrack,
        });

        // Create progress record
        const vaultActivationDate = db.calculateVaultActivationDate(input.dob);
        await db.createFdfProgress({
          userId: ctx.user.id,
          vaultActivationDate,
        });

        return { success: true };
      }),

    // Get missions for user
    getMissions: protectedProcedure.query(async ({ ctx }) => {
      const fdfUser = await db.getFdfUserByUserId(ctx.user.id);
      if (!fdfUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Complete onboarding first",
        });
      }

      const missions = await db.getActiveMissions(fdfUser.yearTrack);
      const completions = await db.getUserMissionCompletions(ctx.user.id);

      return {
        missions,
        completions,
      };
    }),

    // Claim mission reward
    claimMission: protectedProcedure
      .input(z.object({ missionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const fdfUser = await db.getFdfUserByUserId(ctx.user.id);
        if (!fdfUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Complete onboarding first",
          });
        }

        // Get mission
        const missions = await db.getActiveMissions(fdfUser.yearTrack);
        const mission = missions.find(m => m.id === input.missionId);
        if (!mission) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Mission not found",
          });
        }

        // Check if already claimed
        const completions = await db.getUserMissionCompletions(ctx.user.id);
        const existing = completions.find(c => c.missionId === input.missionId);
        if (existing && existing.status === "claimed") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Already claimed",
          });
        }

        // Update or create completion
        if (existing) {
          await db.updateMissionCompletion(ctx.user.id, input.missionId, "claimed");
        } else {
          await db.createMissionCompletion({
            userId: ctx.user.id,
            missionId: input.missionId,
            status: "claimed",
          });
        }

        // Update progress
        const progress = await db.getFdfProgress(ctx.user.id);
        if (progress) {
          const newXp = progress.xpTotal + mission.xpReward;
          const newGems = progress.gemsTotal + mission.gemsReward;
          const newRank = db.calculateRank(newXp);

          await db.updateFdfProgress(ctx.user.id, {
            xpTotal: newXp,
            gemsTotal: newGems,
            rankName: newRank,
          });
        }

        return { success: true };
      }),

    // Get rewards
    getRewards: protectedProcedure.query(async ({ ctx }) => {
      const allRewards = await db.getAllRewards();
      const userRewards = await db.getUserRewards(ctx.user.id);
      
      return {
        allRewards,
        userRewards,
      };
    }),

    // Unlock reward
    unlockReward: protectedProcedure
      .input(z.object({ rewardId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const progress = await db.getFdfProgress(ctx.user.id);
        if (!progress) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Complete onboarding first",
          });
        }

        // Get reward
        const allRewards = await db.getAllRewards();
        const reward = allRewards.find(r => r.id === input.rewardId);
        if (!reward) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reward not found",
          });
        }

        // Check if already unlocked
        const userRewards = await db.getUserRewards(ctx.user.id);
        if (userRewards.some(ur => ur.rewardId === input.rewardId)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Already unlocked",
          });
        }

        // Check if user has enough gems
        if (progress.gemsTotal < reward.costGems) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Not enough gems",
          });
        }

        // Unlock reward
        await db.unlockReward({
          userId: ctx.user.id,
          rewardId: input.rewardId,
        });

        // Deduct gems
        await db.updateFdfProgress(ctx.user.id, {
          gemsTotal: progress.gemsTotal - reward.costGems,
        });

        return { success: true };
      }),

    // Daily check-in
    checkIn: protectedProcedure.mutation(async ({ ctx }) => {
      const progress = await db.getFdfProgress(ctx.user.id);
      if (!progress) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Complete onboarding first",
        });
      }

      const today = new Date().toISOString().split('T')[0];
      
      // Check if already checked in today
      if (progress.lastCheckin === today) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already checked in today",
        });
      }

      // Calculate streak
      let newStreak = 1;
      if (progress.lastCheckin) {
        const lastDate = new Date(progress.lastCheckin);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          newStreak = progress.streakDays + 1;
        }
      }

      // Award gems (5 gems per check-in)
      const gemsReward = 5;
      await db.updateFdfProgress(ctx.user.id, {
        lastCheckin: today,
        streakDays: newStreak,
        gemsTotal: progress.gemsTotal + gemsReward,
      });

      return { success: true, streak: newStreak, gemsEarned: gemsReward };
    }),
  }),

  sponsors: router({
    submitLead: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          company: z.string().optional(),
          email: z.string().email(),
          budget: z.string().optional(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createSponsorLead(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
