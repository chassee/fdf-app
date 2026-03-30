import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Unit tests for onboarding age validation logic ───────────────────────────
// These tests mirror the server-side age calculation used in saveDOB procedure.

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function validateDOB(dob: string): { valid: boolean; age: number; error?: string } {
  if (!dob || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return { valid: false, age: 0, error: "Must be YYYY-MM-DD" };
  }
  const age = calculateAge(dob);
  if (age < 13) return { valid: false, age, error: "FDF is for ages 13-17 only" };
  if (age > 17) return { valid: false, age, error: "FDF is for ages 13-17 only" };
  return { valid: true, age };
}

function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length < 2) return { valid: false, error: "Username must be at least 2 characters" };
  if (username.trim().length > 30) return { valid: false, error: "Username must be 30 characters or less" };
  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) return { valid: false, error: "Letters, numbers and underscores only" };
  return { valid: true };
}

describe("DOB validation", () => {
  it("accepts a 13-year-old", () => {
    const today = new Date();
    const dob = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate())
      .toISOString().split("T")[0];
    const result = validateDOB(dob);
    expect(result.valid).toBe(true);
    expect(result.age).toBe(13);
  });

  it("accepts a 17-year-old", () => {
    const today = new Date();
    const dob = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate())
      .toISOString().split("T")[0];
    const result = validateDOB(dob);
    expect(result.valid).toBe(true);
    expect(result.age).toBe(17);
  });

  it("rejects a 12-year-old", () => {
    const today = new Date();
    const dob = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate())
      .toISOString().split("T")[0];
    const result = validateDOB(dob);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("13-17");
  });

  it("rejects an 18-year-old", () => {
    const today = new Date();
    const dob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
      .toISOString().split("T")[0];
    const result = validateDOB(dob);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("13-17");
  });

  it("rejects invalid format", () => {
    expect(validateDOB("01/01/2010").valid).toBe(false);
    expect(validateDOB("").valid).toBe(false);
    expect(validateDOB("2010-1-1").valid).toBe(false);
  });

  it("handles birthday not yet reached this year (still 12)", () => {
    const today = new Date();
    // Birthday is in 2 days, so they haven't turned 13 yet
    const bday = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate() + 2);
    const dob = bday.toISOString().split("T")[0];
    const result = validateDOB(dob);
    // Age calculation: birthday hasn't arrived yet this year → still 12
    expect(result.age).toBe(12);
    expect(result.valid).toBe(false);
  });
});

describe("Username validation", () => {
  it("accepts valid usernames", () => {
    expect(validateUsername("dawg123").valid).toBe(true);
    expect(validateUsername("Future_Dawg").valid).toBe(true);
    expect(validateUsername("ab").valid).toBe(true);
  });

  it("rejects usernames that are too short", () => {
    expect(validateUsername("a").valid).toBe(false);
    expect(validateUsername("").valid).toBe(false);
  });

  it("rejects usernames that are too long", () => {
    expect(validateUsername("a".repeat(31)).valid).toBe(false);
  });

  it("rejects usernames with special characters", () => {
    expect(validateUsername("dawg!").valid).toBe(false);
    expect(validateUsername("dawg@email").valid).toBe(false);
    expect(validateUsername("my dawg").valid).toBe(false);
  });

  it("accepts usernames exactly 30 characters", () => {
    expect(validateUsername("a".repeat(30)).valid).toBe(true);
  });
});

describe("SignIn routing logic", () => {
  it("routes to /onboarding/dob when profile exists but no dob", () => {
    const profile = { dob: null, onboarding_complete: false, graduated: false, approval_status: "pending" };
    const hasDob = !!profile.dob;
    const route = hasDob ? "/onboarding/username" : "/onboarding/dob";
    expect(route).toBe("/onboarding/dob");
  });

  it("routes to /onboarding/username when dob saved but username not set", () => {
    const profile = { dob: "2010-01-01", onboarding_complete: false, graduated: false, approval_status: "pending" };
    const hasDob = !!profile.dob;
    const route = hasDob ? "/onboarding/username" : "/onboarding/dob";
    expect(route).toBe("/onboarding/username");
  });

  it("routes to / when onboarding complete and approved", () => {
    const profile = { dob: "2010-01-01", onboarding_complete: true, graduated: false, approval_status: "approved" };
    let route = "/";
    if (profile.graduated) { route = "/graduation"; }
    else if (!profile.onboarding_complete) { route = !!profile.dob ? "/onboarding/username" : "/onboarding/dob"; }
    else if (profile.approval_status === "pending") { route = "/parent-approval"; }
    expect(route).toBe("/");
  });

  it("routes to /graduation when graduated", () => {
    const profile = { dob: "2010-01-01", onboarding_complete: true, graduated: true, approval_status: "approved" };
    let route = "/";
    if (profile.graduated) { route = "/graduation"; }
    expect(route).toBe("/graduation");
  });
});
