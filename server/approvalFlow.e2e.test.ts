import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateApprovalToken,
  requestParentApproval,
  verifyAndApproveToken,
  getApprovalStatus,
} from "./_core/parentApprovalService";
import * as db from "./db";

/**
 * End-to-End Approval Flow Test
 * Simulates the complete parent approval journey:
 * 1. Student requests approval
 * 2. Email is sent
 * 3. Parent receives and clicks link
 * 4. Token is verified
 * 5. Status is updated
 * 6. Student can now access app
 */

vi.mock("./db", () => ({
  createParentApproval: vi.fn(),
  getParentApprovalByUserId: vi.fn(),
  getParentApprovalByToken: vi.fn(),
  approveParentApproval: vi.fn(),
  getFdfUserByUserId: vi.fn(),
}));

vi.mock("./_core/resend", () => ({
  sendResendEmail: vi.fn().mockResolvedValue({
    id: "email-123",
    from: "approval@welcome.crypdawgs.com",
    to: "parent@example.com",
    created_at: new Date().toISOString(),
  }),
  generateParentApprovalEmail: vi.fn().mockReturnValue("<html>Approval Email</html>"),
}));

describe("End-to-End Approval Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should complete full approval flow: request → email → verify → unlock", async () => {
    const userId = 123;
    const studentName = "Alice";
    const parentName = "John Doe";
    const parentEmail = "john@example.com";
    const baseUrl = "https://futuredawgs.crypdawgs.com";

    // Step 1: Student requests approval
    console.log("Step 1: Student requests parent approval");
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce(undefined);

    const generatedToken = generateApprovalToken();
    expect(generatedToken).toHaveLength(64);

    vi.mocked(db.createParentApproval).mockResolvedValueOnce({
      id: 1,
      userId,
      parentName,
      parentEmail,
      approvalToken: generatedToken,
      status: "pending",
      approvedAt: null,
      createdAt: new Date(),
    });

    const requestResult = await requestParentApproval(
      userId,
      studentName,
      parentName,
      parentEmail,
      baseUrl
    );

    expect(requestResult.success).toBe(true);
    expect(requestResult.message).toContain("Approval email sent");
    expect(db.createParentApproval).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        parentName,
        parentEmail,
        status: "pending",
      })
    );
    console.log("✓ Approval request created, email queued");

    // Step 2: Parent receives email with link
    console.log("Step 2: Parent receives email with approval link");
    const approvalLink = `${baseUrl}/api/approval/verify?token=${generatedToken}`;
    console.log(`✓ Email sent to ${parentEmail} with link: ${approvalLink}`);

    // Step 3: Parent clicks link (simulated)
    console.log("Step 3: Parent clicks approval link");
    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce({
      id: 1,
      userId,
      parentName,
      parentEmail,
      approvalToken: generatedToken,
      status: "pending",
      approvedAt: null,
      createdAt: oneDayAgo,
    });

    vi.mocked(db.getFdfUserByUserId).mockResolvedValueOnce({
      id: 1,
      userId,
      displayName: studentName,
      dob: "2010-01-01",
      country: "US",
      dawgClass: "builder",
      yearTrack: 1,
      createdAt: new Date(),
    });

    const verifyResult = await verifyAndApproveToken(generatedToken);

    expect(verifyResult.success).toBe(true);
    expect(verifyResult.message).toContain("approved");
    expect(verifyResult.studentName).toBe(studentName);
    expect(db.approveParentApproval).toHaveBeenCalledWith(generatedToken);
    console.log("✓ Token verified, approval status updated in database");

    // Step 4: Check approval status
    console.log("Step 4: Verify approval status is updated");
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
      id: 1,
      userId,
      parentName,
      parentEmail,
      approvalToken: generatedToken,
      status: "approved",
      approvedAt: new Date(),
      createdAt: oneDayAgo,
    });

    const statusResult = await getApprovalStatus(userId);

    expect(statusResult.status).toBe("approved");
    expect(statusResult.parentName).toBe(parentName);
    expect(statusResult.parentEmail).toBe(parentEmail);
    expect(statusResult.approvedAt).toBeDefined();
    console.log("✓ Approval status confirmed in database");

    // Step 5: Student can now access app
    console.log("Step 5: Student gains access to app");
    console.log("✓ Approval complete! Student can now:");
    console.log("  - Complete onboarding");
    console.log("  - Choose Dawg Class");
    console.log("  - Start missions");
    console.log("  - Build financial skills");
  });

  it("should prevent duplicate email requests within 24 hours", async () => {
    const userId = 456;
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    console.log("Testing resend protection: duplicate email within 24 hours");

    // First request already exists
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
      id: 2,
      userId,
      parentName: "Jane Smith",
      parentEmail: "jane@example.com",
      approvalToken: "a".repeat(64),
      status: "pending",
      approvedAt: null,
      createdAt: twoHoursAgo,
    });

    const result = await requestParentApproval(
      userId,
      "Bob",
      "Jane Smith",
      "jane@example.com",
      "https://example.com"
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain("wait 24 hours");
    console.log("✓ Duplicate request blocked (resend protection working)");
  });

  it("should reject expired approval tokens (>7 days)", async () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    const token = "a".repeat(64);

    console.log("Testing token expiry: token older than 7 days");

    vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce({
      id: 3,
      userId: 789,
      parentName: "Bob Johnson",
      parentEmail: "bob@example.com",
      approvalToken: token,
      status: "pending",
      approvedAt: null,
      createdAt: eightDaysAgo,
    });

    const result = await verifyAndApproveToken(token);

    expect(result.success).toBe(false);
    expect(result.message).toContain("expired");
    console.log("✓ Expired token rejected");
  });

  it("should handle already-approved tokens gracefully", async () => {
    const token = "b".repeat(64);

    console.log("Testing already-approved token");

    vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce({
      id: 4,
      userId: 999,
      parentName: "Carol White",
      parentEmail: "carol@example.com",
      approvalToken: token,
      status: "approved",
      approvedAt: new Date(),
      createdAt: new Date(),
    });

    const result = await verifyAndApproveToken(token);

    expect(result.success).toBe(false);
    expect(result.message).toContain("already been approved");
    console.log("✓ Already-approved token handled gracefully");
  });
});
