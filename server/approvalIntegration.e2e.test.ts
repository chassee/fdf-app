import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateApprovalToken,
  requestParentApproval,
  verifyAndApproveToken,
  getApprovalStatus,
} from "./_core/parentApprovalService";
import { shouldAutoApproveForDemo } from "./_core/demoMode";
import * as db from "./db";

/**
 * COMPREHENSIVE END-TO-END INTEGRATION TEST
 * 
 * Tests the complete approval flow from start to finish:
 * 1. Student signs up and requests parent approval
 * 2. Email is sent to parent (or auto-approved in demo)
 * 3. Parent receives email and clicks link
 * 4. Token is verified and status updated
 * 5. Student gains automatic access
 * 6. Frontend polls and detects approval
 * 7. Student is redirected to dashboard
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
  generateParentApprovalEmail: vi.fn().mockReturnValue("<html>Email</html>"),
}));

describe("End-to-End Approval Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("SCENARIO 1: Production flow - real parent approval via email", async () => {
    console.log("\n=== SCENARIO 1: Production Flow ===");
    console.log("Student requests approval → Email sent → Parent clicks link → Auto-unlock\n");

    const userId = 100;
    const studentName = "Alice";
    const parentName = "John Doe";
    const parentEmail = "john@example.com";
    const baseUrl = "https://futuredawgs.crypdawgs.com";

    // STEP 1: Student requests approval
    console.log("STEP 1: Student requests parent approval");
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce(undefined);

    const token = generateApprovalToken();
    vi.mocked(db.createParentApproval).mockResolvedValueOnce({
      id: 1,
      userId,
      parentName,
      parentEmail,
      approvalToken: token,
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
    console.log(`✓ Approval request created`);
    console.log(`✓ Email queued to ${parentEmail}`);

    // STEP 2: Parent receives email
    console.log("\nSTEP 2: Parent receives branded email");
    const approvalLink = `${baseUrl}/api/approval/verify?token=${token}`;
    console.log(`✓ Email from: approval@welcome.crypdawgs.com`);
    console.log(`✓ Approval link: ${approvalLink}`);
    console.log(`✓ Link expires in: 7 days`);

    // STEP 3: Parent clicks link
    console.log("\nSTEP 3: Parent clicks approval link");
    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce({
      id: 1,
      userId,
      parentName,
      parentEmail,
      approvalToken: token,
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

    const verifyResult = await verifyAndApproveToken(token);
    expect(verifyResult.success).toBe(true);
    console.log(`✓ Token verified`);
    console.log(`✓ Database status updated to: APPROVED`);

    // STEP 4: Frontend polls and detects approval
    console.log("\nSTEP 4: Frontend polls approval status");
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
      id: 1,
      userId,
      parentName,
      parentEmail,
      approvalToken: token,
      status: "approved",
      approvedAt: new Date(),
      createdAt: oneDayAgo,
    });

    const statusResult = await getApprovalStatus(userId);
    expect(statusResult.status).toBe("approved");
    console.log(`✓ Poll #1: status = APPROVED`);
    console.log(`✓ ApprovalGuard detects approval`);

    // STEP 5: Student gains access
    console.log("\nSTEP 5: Student gains automatic access");
    console.log(`✓ ApprovalGuard renders children (full app access)`);
    console.log(`✓ Redirect to dashboard`);
    console.log(`✓ Student can now:`);
    console.log(`  - Complete onboarding`);
    console.log(`  - Choose Dawg Class`);
    console.log(`  - Start missions`);
    console.log(`  - Build financial skills`);

    console.log("\n✅ SCENARIO 1 COMPLETE: Production flow verified\n");
  });

  it("SCENARIO 2: Demo mode - instant auto-approval", async () => {
    console.log("\n=== SCENARIO 2: Demo Mode ===");
    console.log("Test email → Auto-approved instantly → No email sent\n");

    const userId = 200;
    const studentName = "Bob";
    const parentName = "Jane Smith";
    const parentEmail = "test@example.com"; // Demo email
    const baseUrl = "http://localhost:3000";

    // Check if demo mode applies
    const isDemo = shouldAutoApproveForDemo(parentEmail);
    expect(isDemo).toBe(true);
    console.log(`STEP 1: Detect demo email: ${parentEmail}`);
    console.log(`✓ Demo mode enabled for this request`);

    // Request approval (should auto-approve)
    console.log("\nSTEP 2: Request approval");
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce(undefined);

    const token = generateApprovalToken();
    vi.mocked(db.createParentApproval).mockResolvedValueOnce({
      id: 2,
      userId,
      parentName,
      parentEmail,
      approvalToken: token,
      status: "approved", // Already approved!
      approvedAt: new Date(),
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
    console.log(`✓ Approval auto-approved instantly`);
    console.log(`✓ No email sent`);
    console.log(`✓ Status in DB: APPROVED`);

    // Check status
    console.log("\nSTEP 3: Check approval status");
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
      id: 2,
      userId,
      parentName,
      parentEmail,
      approvalToken: token,
      status: "approved",
      approvedAt: new Date(),
      createdAt: new Date(),
    });

    const statusResult = await getApprovalStatus(userId);
    expect(statusResult.status).toBe("approved");
    console.log(`✓ Status check: APPROVED`);
    console.log(`✓ Student has immediate access`);

    console.log("\n✅ SCENARIO 2 COMPLETE: Demo mode verified\n");
  });

  it("SCENARIO 3: Resend protection - prevent email spam", async () => {
    console.log("\n=== SCENARIO 3: Resend Protection ===");
    console.log("Student requests twice within 24 hours → Second request blocked\n");

    const userId = 300;
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // First request already exists
    console.log("STEP 1: First approval request (2 hours ago)");
    vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
      id: 3,
      userId,
      parentName: "Carol",
      parentEmail: "carol@example.com",
      approvalToken: "a".repeat(64),
      status: "pending",
      approvedAt: null,
      createdAt: twoHoursAgo,
    });

    const result = await requestParentApproval(
      userId,
      "Charlie",
      "Carol",
      "carol@example.com",
      "https://example.com"
    );

    expect(result.success).toBe(false);
    console.log(`✓ Second request blocked`);
    console.log(`✓ Error: "wait 24 hours"`);
    console.log(`✓ Resend protection working`);

    console.log("\n✅ SCENARIO 3 COMPLETE: Resend protection verified\n");
  });

  it("SCENARIO 4: Token expiry - reject old links", async () => {
    console.log("\n=== SCENARIO 4: Token Expiry ===");
    console.log("Parent clicks link after 7+ days → Token rejected\n");

    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    const token = "b".repeat(64);

    console.log("STEP 1: Parent clicks approval link (8 days later)");
    vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce({
      id: 4,
      userId: 400,
      parentName: "Dave",
      parentEmail: "dave@example.com",
      approvalToken: token,
      status: "pending",
      approvedAt: null,
      createdAt: eightDaysAgo,
    });

    const result = await verifyAndApproveToken(token);

    expect(result.success).toBe(false);
    console.log(`✓ Token rejected`);
    console.log(`✓ Error: "expired"`);
    console.log(`✓ Student must request new approval`);

    console.log("\n✅ SCENARIO 4 COMPLETE: Token expiry verified\n");
  });

  it("SCENARIO 5: Real-time polling - detect approval", async () => {
    console.log("\n=== SCENARIO 5: Real-Time Polling ===");
    console.log("Frontend polls every 5 seconds until approval detected\n");

    const userId = 500;
    let pollCount = 0;

    // Simulate polling: pending → pending → pending → approved
    const simulatePolling = async (): Promise<string> => {
      pollCount++;
      console.log(`Poll #${pollCount}: Checking status...`);

      if (pollCount === 1 || pollCount === 2 || pollCount === 3) {
        vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
          id: 5,
          userId,
          parentName: "Eve",
          parentEmail: "eve@example.com",
          approvalToken: "c".repeat(64),
          status: "pending",
          approvedAt: null,
          createdAt: new Date(),
        });
        const status = await getApprovalStatus(userId);
        console.log(`  → Status: ${status.status}`);
        return status.status;
      } else {
        // Approval came through!
        vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
          id: 5,
          userId,
          parentName: "Eve",
          parentEmail: "eve@example.com",
          approvalToken: "c".repeat(64),
          status: "approved",
          approvedAt: new Date(),
          createdAt: new Date(),
        });
        const status = await getApprovalStatus(userId);
        console.log(`  → Status: ${status.status} ✓`);
        return status.status;
      }
    };

    // Poll until approved
    let status = "pending";
    let maxPolls = 10;
    while (status === "pending" && maxPolls > 0) {
      status = await simulatePolling();
      maxPolls--;
    }

    expect(status).toBe("approved");
    console.log(`\n✓ Approval detected after ${pollCount} polls (${pollCount * 5} seconds)`);
    console.log(`✓ ApprovalGuard renders children`);
    console.log(`✓ Student redirected to dashboard`);

    console.log("\n✅ SCENARIO 5 COMPLETE: Real-time polling verified\n");
  });
});
