import { Request, Response } from "express";
import { verifyAndApproveToken } from "./parentApprovalService";

/**
 * Express endpoint for approval token verification
 * Called when parent clicks the approval link in email
 * GET /api/approval/verify?token=<token>
 */
export async function handleApprovalVerification(req: Request, res: Response): Promise<void> {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid or missing approval token.",
      });
      return;
    }

    // Verify and process the token
    const result = await verifyAndApproveToken(token);

    if (!result.success) {
      // Token is invalid, expired, or already used
      res.status(400).json({
        success: false,
        message: result.message,
      });
      return;
    }

    // Success! Redirect to approval success page with student name
    const successUrl = `/approval-success?studentName=${encodeURIComponent(result.studentName || "Student")}`;
    res.redirect(successUrl);
  } catch (error) {
    console.error("[ApprovalEndpoint] Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the approval. Please try again.",
    });
  }
}
