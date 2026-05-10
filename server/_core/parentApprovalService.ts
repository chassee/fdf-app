import { randomBytes } from "crypto";
import * as db from "../db";
import { sendResendEmail, generateParentApprovalEmail } from "./resend";
import { shouldAutoApproveForDemo } from "./demoMode";

/**
 * Parent Approval Service
 * Handles the complete parent approval workflow:
 * 1. Generate secure token
 * 2. Send branded email via Resend
 * 3. Log email send to database
 * 4. Validate tokens and process approvals
 * 5. Prevent duplicate email spam
 */

const APPROVAL_TOKEN_EXPIRY_DAYS = 7;
const MIN_EMAIL_RESEND_HOURS = 24; // Prevent spam: don't resend within 24 hours

/**
 * Generate a secure random approval token
 */
export function generateApprovalToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Check if an approval email was recently sent (within MIN_EMAIL_RESEND_HOURS)
 */
export async function wasApprovalEmailRecentlySent(userId: number): Promise<boolean> {
  const approval = await db.getParentApprovalByUserId(userId);
  if (!approval) return false;

  const createdAt = new Date(approval.createdAt);
  const now = new Date();
  const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  return hoursSinceCreation < MIN_EMAIL_RESEND_HOURS;
}

/**
 * Request parent approval for a user
 * Generates token, sends email, logs to database
 */
export async function requestParentApproval(
  userId: number,
  studentName: string,
  parentName: string,
  parentEmail: string,
  approvalBaseUrl: string
): Promise<{
  success: boolean;
  message: string;
  tokenId?: string;
}> {
  try {
    // Check if email was recently sent (resend protection)
    const recentlySent = await wasApprovalEmailRecentlySent(userId);
    if (recentlySent) {
      return {
        success: false,
        message: `An approval email was recently sent to ${parentEmail}. Please wait 24 hours before requesting another.`,
      };
    }

    // Generate secure token
    const token = generateApprovalToken();

    // Check if demo mode should auto-approve
    const isDemo = shouldAutoApproveForDemo(parentEmail);
    const status = isDemo ? "approved" : "pending";

    // Create approval record in database
    const approval = await db.createParentApproval({
      userId,
      parentName,
      parentEmail,
      approvalToken: token,
      status,
    });

    // If demo mode, auto-approve and skip email
    if (isDemo) {
      console.log(
        `[ParentApproval] Demo mode: Auto-approved. User ID: ${userId}, Parent: ${parentName}, Email: ${parentEmail}`
      );
      return {
        success: true,
        message: `Demo mode: ${studentName} has been automatically approved!`,
        tokenId: approval.id.toString(),
      };
    }

    // Generate approval link
    const approvalLink = `${approvalBaseUrl}/api/approval/verify?token=${token}`;

    // Generate HTML email
    const htmlEmail = generateParentApprovalEmail(studentName, approvalLink);

    // Send email via Resend
    const emailResult = await sendResendEmail({
      to: parentEmail,
      subject: `${studentName} Needs Your Approval for Future Dawgs Foundation`,
      html: htmlEmail,
    });

    // Log successful email send
    console.log(`[ParentApproval] Email sent successfully. Resend ID: ${emailResult.id}, User ID: ${userId}`);

    return {
      success: true,
      message: `Approval email sent to ${parentEmail}. Parent has ${APPROVAL_TOKEN_EXPIRY_DAYS} days to approve.`,
      tokenId: approval.id.toString(),
    };
  } catch (error) {
    console.error("[ParentApproval] Error sending approval email:", error);
    return {
      success: false,
      message: "Failed to send approval email. Please try again later.",
    };
  }
}

/**
 * Verify approval token and process approval
 */
export async function verifyAndApproveToken(token: string): Promise<{
  success: boolean;
  message: string;
  userId?: number;
  studentName?: string;
}> {
  try {
    // Validate token format
    if (!token || typeof token !== "string" || token.length !== 64) {
      return {
        success: false,
        message: "Invalid approval token format.",
      };
    }

    // Look up approval by token
    const approval = await db.getParentApprovalByToken(token);
    if (!approval) {
      return {
        success: false,
        message: "Approval token not found or has already been used.",
      };
    }

    // Check if already approved
    if (approval.status === "approved") {
      return {
        success: false,
        message: "This student has already been approved.",
      };
    }

    // Check if denied
    if (approval.status === "denied") {
      return {
        success: false,
        message: "This approval request has been denied.",
      };
    }

    // Check token expiry
    const createdAt = new Date(approval.createdAt);
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceCreation > APPROVAL_TOKEN_EXPIRY_DAYS) {
      return {
        success: false,
        message: `This approval link has expired (${APPROVAL_TOKEN_EXPIRY_DAYS} days). Please request a new one.`,
      };
    }

    // Approve the token
    await db.approveParentApproval(token);

    // Get student name from FDF user profile
    const fdfUser = await db.getFdfUserByUserId(approval.userId);
    const studentName = fdfUser?.displayName || "Student";

    console.log(
      `[ParentApproval] Approval verified successfully. User ID: ${approval.userId}, Parent: ${approval.parentName}`
    );

    return {
      success: true,
      message: `${studentName} has been approved! They can now access Future Dawgs Foundation.`,
      userId: approval.userId,
      studentName,
    };
  } catch (error) {
    console.error("[ParentApproval] Error verifying token:", error);
    return {
      success: false,
      message: "An error occurred while processing the approval. Please try again.",
    };
  }
}

/**
 * Get approval status for a user
 */
export async function getApprovalStatus(userId: number): Promise<{
  status: "pending" | "approved" | "denied" | "not_requested";
  parentName?: string;
  parentEmail?: string;
  approvedAt?: string;
  createdAt?: string;
}> {
  const approval = await db.getParentApprovalByUserId(userId);

  if (!approval) {
    return { status: "not_requested" };
  }

  return {
    status: approval.status,
    parentName: approval.parentName,
    parentEmail: approval.parentEmail,
    approvedAt: approval.approvedAt ? new Date(approval.approvedAt).toISOString() : undefined,
    createdAt: new Date(approval.createdAt).toISOString(),
  };
}
