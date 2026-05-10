import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateApprovalToken,
  wasApprovalEmailRecentlySent,
  requestParentApproval,
  verifyAndApproveToken,
  getApprovalStatus,
} from "./_core/parentApprovalService";
import * as db from "./db";

// Mock the database functions
vi.mock("./db", () => ({
  createParentApproval: vi.fn(),
  getParentApprovalByUserId: vi.fn(),
  getParentApprovalByToken: vi.fn(),
  approveParentApproval: vi.fn(),
  getFdfUserByUserId: vi.fn(),
}));

// Mock Resend
vi.mock("./_core/resend", () => ({
  sendResendEmail: vi.fn().mockResolvedValue({
    id: "test-email-id-123",
    from: "approval@welcome.crypdawgs.com",
    to: "parent@example.com",
    created_at: new Date().toISOString(),
  }),
  generateParentApprovalEmail: vi.fn().mockReturnValue("<html>Test Email</html>"),
}));

describe("Parent Approval Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateApprovalToken", () => {
    it("should generate a 64-character hex token", () => {
      const token = generateApprovalToken();
      expect(token).toHaveLength(64);
      expect(/^[a-f0-9]{64}$/.test(token)).toBe(true);
    });

    it("should generate unique tokens", () => {
      const token1 = generateApprovalToken();
      const token2 = generateApprovalToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe("wasApprovalEmailRecentlySent", () => {
    it("should return false if no approval exists", async () => {
      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce(undefined);
      const result = await wasApprovalEmailRecentlySent(123);
      expect(result).toBe(false);
    });

    it("should return true if email was sent within 24 hours", async () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: "token123",
        status: "pending",
        approvedAt: null,
        createdAt: twoHoursAgo,
      });

      const result = await wasApprovalEmailRecentlySent(123);
      expect(result).toBe(true);
    });

    it("should return false if email was sent more than 24 hours ago", async () => {
      const now = new Date();
      const twooDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: "token123",
        status: "pending",
        approvedAt: null,
        createdAt: twooDaysAgo,
      });

      const result = await wasApprovalEmailRecentlySent(123);
      expect(result).toBe(false);
    });
  });

  describe("requestParentApproval", () => {
    it("should prevent duplicate emails within 24 hours", async () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: "token123",
        status: "pending",
        approvedAt: null,
        createdAt: oneHourAgo,
      });

      const result = await requestParentApproval(
        123,
        "Alice",
        "John Doe",
        "john@example.com",
        "https://example.com"
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain("wait 24 hours");
    });

    it("should create approval record and send email", async () => {
      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce(undefined);
      vi.mocked(db.createParentApproval).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: "a".repeat(64),
        status: "pending",
        approvedAt: null,
        createdAt: new Date(),
      });

      const result = await requestParentApproval(
        123,
        "Alice",
        "John Doe",
        "john@example.com",
        "https://example.com"
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain("Approval email sent");
      expect(db.createParentApproval).toHaveBeenCalled();
    });
  });

  describe("verifyAndApproveToken", () => {
    it("should reject invalid token format", async () => {
      const result = await verifyAndApproveToken("invalid");
      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid");
    });

    it("should reject non-existent token", async () => {
      vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce(undefined);
      const token = "a".repeat(64);

      const result = await verifyAndApproveToken(token);
      expect(result.success).toBe(false);
      expect(result.message).toContain("not found");
    });

    it("should reject expired token (>7 days old)", async () => {
      const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
      const token = "a".repeat(64);

      vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: token,
        status: "pending",
        approvedAt: null,
        createdAt: eightDaysAgo,
      });

      const result = await verifyAndApproveToken(token);
      expect(result.success).toBe(false);
      expect(result.message).toContain("expired");
    });

    it("should approve valid token", async () => {
      const token = "a".repeat(64);
      const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

      vi.mocked(db.getParentApprovalByToken).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: token,
        status: "pending",
        approvedAt: null,
        createdAt: oneDayAgo,
      });

      vi.mocked(db.getFdfUserByUserId).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        displayName: "Alice",
        dob: "2010-01-01",
        country: "US",
        dawgClass: "builder",
        yearTrack: 1,
        createdAt: new Date(),
      });

      const result = await verifyAndApproveToken(token);
      expect(result.success).toBe(true);
      expect(result.message).toContain("approved");
      expect(db.approveParentApproval).toHaveBeenCalledWith(token);
    });
  });

  describe("getApprovalStatus", () => {
    it("should return not_requested if no approval exists", async () => {
      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce(undefined);

      const result = await getApprovalStatus(123);
      expect(result.status).toBe("not_requested");
    });

    it("should return pending status", async () => {
      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: "token123",
        status: "pending",
        approvedAt: null,
        createdAt: new Date(),
      });

      const result = await getApprovalStatus(123);
      expect(result.status).toBe("pending");
      expect(result.parentName).toBe("John Doe");
      expect(result.parentEmail).toBe("john@example.com");
    });

    it("should return approved status with timestamp", async () => {
      const approvedTime = new Date();
      vi.mocked(db.getParentApprovalByUserId).mockResolvedValueOnce({
        id: 1,
        userId: 123,
        parentName: "John Doe",
        parentEmail: "john@example.com",
        approvalToken: "token123",
        status: "approved",
        approvedAt: approvedTime,
        createdAt: new Date(),
      });

      const result = await getApprovalStatus(123);
      expect(result.status).toBe("approved");
      expect(result.approvedAt).toBeDefined();
    });
  });
});
