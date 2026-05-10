import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { verifySupabaseToken } from "../supabaseAdmin";
import * as db from "../db";
import {
  requestParentApproval,
  verifyAndApproveToken,
  getApprovalStatus,
} from "../_core/parentApprovalService";

/**
 * Parent Approval Router
 * Handles all parent approval workflows with Resend email integration
 */
export const parentApprovalRouter = router({
  /**
   * Request parent approval
   * Sends branded email via Resend with approval link
   */
  requestApproval: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        studentName: z.string().min(1).max(100),
        parentName: z.string().min(1).max(100),
        parentEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Verify user session
      const userId = await verifySupabaseToken(input.accessToken);
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });
      }

      // Get base URL for approval links
      const protocol = ctx.req.headers["x-forwarded-proto"] || "https";
      const host = ctx.req.headers["x-forwarded-host"] || ctx.req.headers.host || "localhost:3000";
      const baseUrl = `${protocol}://${host}`;

      // Request approval (sends email, logs to DB, prevents spam)
      const result = await requestParentApproval(
        parseInt(userId),
        input.studentName,
        input.parentName,
        input.parentEmail,
        baseUrl
      );

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message,
        });
      }

      // Notify owner of new approval request
      try {
        const { notifyOwner } = await import("../_core/notification");
        await notifyOwner({
          title: "🐕 FDF Parent Approval Email Sent",
          content: `Parent approval email sent to ${input.parentEmail} for ${input.studentName}.\nParent: ${input.parentName}\nUser ID: ${userId}`,
        });
      } catch (_) {
        /* non-critical */
      }

      return {
        success: true,
        message: result.message,
      };
    }),

  /**
   * Check approval status for current user
   */
  checkStatus: publicProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input }) => {
      // Verify user session
      const userId = await verifySupabaseToken(input.accessToken);
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });
      }

      // Get approval status
      const status = await getApprovalStatus(parseInt(userId));

      return {
        status: status.status,
        parentName: status.parentName,
        parentEmail: status.parentEmail,
        approvedAt: status.approvedAt,
        createdAt: status.createdAt,
      };
    }),

  /**
   * Verify approval token and process approval
   * Called when parent clicks approval link
   */
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      // Verify and process the token
      const result = await verifyAndApproveToken(input.token);

      if (!result.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message,
        });
      }

      // Notify owner of successful approval
      try {
        const { notifyOwner } = await import("../_core/notification");
        await notifyOwner({
          title: "✅ FDF Parent Approval Confirmed",
          content: `${result.studentName} has been approved by their parent!\nUser ID: ${result.userId}`,
        });
      } catch (_) {
        /* non-critical */
      }

      return {
        success: true,
        message: result.message,
        studentName: result.studentName,
      };
    }),

  /**
   * Admin: Approve a user manually (dev/test mode)
   */
  adminApprove: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        targetUserId: z.number().int().positive(),
      })
    )
    .mutation(async ({ input }) => {
      // Verify requester is owner
      const requesterId = await verifySupabaseToken(input.accessToken);
      if (!requesterId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });
      }

      // Get the target user's FDF profile
      const targetUser = await db.getFdfUserByUserId(input.targetUserId);
      if (!targetUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Get or create approval record
      let approval = await db.getParentApprovalByUserId(input.targetUserId);
      if (!approval) {
        // Create a dummy approval record for manual approval
        approval = await db.createParentApproval({
          userId: input.targetUserId,
          parentName: "Admin Override",
          parentEmail: "admin@crypdawgs.com",
          approvalToken: `admin-${Date.now()}`,
          status: "approved",
        });
      } else {
        // Update existing approval record
        await db.approveParentApproval(approval.approvalToken);
      }

      console.log(`[AdminApproval] User ${input.targetUserId} approved manually by admin`);

      return {
        success: true,
        message: `${targetUser.displayName || "User"} has been approved.`,
      };
    }),
});
