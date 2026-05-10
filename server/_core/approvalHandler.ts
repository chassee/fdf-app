import { Request, Response } from "express";
import { verifyAndApproveToken } from "./parentApprovalService";

/**
 * Express middleware for handling approval token verification
 * GET /api/approval/verify?token=<token>
 * 
 * When parent clicks the approval link in email, this endpoint:
 * 1. Validates the token
 * 2. Updates database status to "approved"
 * 3. Redirects to success page
 */
export async function handleApprovalTokenVerification(req: Request, res: Response): Promise<void> {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      // Invalid token
      res.status(400).redirect("/approval-success?error=invalid_token");
      return;
    }

    // Verify and process the token
    const result = await verifyAndApproveToken(token);

    if (!result.success) {
      // Token is invalid, expired, or already used
      const errorParam = encodeURIComponent(result.message);
      res.status(400).redirect(`/approval-success?error=${errorParam}`);
      return;
    }

    // Success! Redirect to approval success page with student name
    const studentNameParam = encodeURIComponent(result.studentName || "Student");
    res.redirect(`/approval-success?studentName=${studentNameParam}`);
  } catch (error) {
    console.error("[ApprovalHandler] Unexpected error:", error);
    res.status(500).redirect("/approval-success?error=server_error");
  }
}
