import { describe, it, expect, vi, beforeEach } from "vitest";
import { isDemoEmail, isDemoModeEnabled, shouldAutoApproveForDemo, getDemoModeInfo } from "./_core/demoMode";

describe("Demo Mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isDemoEmail", () => {
    it("should recognize test@ emails as demo", () => {
      expect(isDemoEmail("test@example.com")).toBe(true);
      expect(isDemoEmail("test@crypdawgs.com")).toBe(true);
    });

    it("should recognize demo@ emails as demo", () => {
      expect(isDemoEmail("demo@example.com")).toBe(true);
      expect(isDemoEmail("demo@localhost")).toBe(true);
    });

    it("should recognize dev@ emails as demo", () => {
      expect(isDemoEmail("dev@example.com")).toBe(true);
      expect(isDemoEmail("dev@test.local")).toBe(true);
    });

    it("should recognize localhost emails as demo", () => {
      expect(isDemoEmail("parent@localhost")).toBe(true);
      expect(isDemoEmail("parent@127.0.0.1")).toBe(true);
    });

    it("should not recognize regular emails as demo", () => {
      expect(isDemoEmail("john@example.com")).toBe(false);
      expect(isDemoEmail("parent@gmail.com")).toBe(false);
      expect(isDemoEmail("carol@crypdawgs.com")).toBe(false);
    });
  });

  describe("shouldAutoApproveForDemo", () => {
    it("should auto-approve demo emails", () => {
      expect(shouldAutoApproveForDemo("test@example.com")).toBe(true);
      expect(shouldAutoApproveForDemo("demo@example.com")).toBe(true);
      expect(shouldAutoApproveForDemo("dev@localhost")).toBe(true);
    });

    it("should not auto-approve regular emails", () => {
      expect(shouldAutoApproveForDemo("john@example.com")).toBe(false);
      expect(shouldAutoApproveForDemo("parent@gmail.com")).toBe(false);
    });
  });

  describe("getDemoModeInfo", () => {
    it("should return demo mode info", () => {
      const info = getDemoModeInfo();
      expect(info).toHaveProperty("enabled");
      expect(info).toHaveProperty("demoEmailsEnabled");
      expect(info).toHaveProperty("message");
      expect(typeof info.message).toBe("string");
    });
  });
});
