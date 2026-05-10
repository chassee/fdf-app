/**
 * Demo Mode for Parent Approval
 * Allows developers to bypass approval in development/testing
 * 
 * Enable with environment variable: DEMO_MODE=true
 * Or use test email addresses: test@example.com, demo@example.com
 */

const DEMO_MODE_ENABLED = process.env.DEMO_MODE === "true";
const DEMO_EMAIL_PATTERNS = [
  /^test@/i,
  /^demo@/i,
  /^dev@/i,
  /localhost/i,
  /127\.0\.0\.1/i,
];

/**
 * Check if email is in demo/test mode
 */
export function isDemoEmail(email: string): boolean {
  return DEMO_EMAIL_PATTERNS.some((pattern) => pattern.test(email));
}

/**
 * Check if demo mode is enabled globally
 */
export function isDemoModeEnabled(): boolean {
  return DEMO_MODE_ENABLED;
}

/**
 * Check if approval should be auto-approved for demo
 */
export function shouldAutoApproveForDemo(parentEmail: string): boolean {
  if (!DEMO_MODE_ENABLED && !isDemoEmail(parentEmail)) {
    return false;
  }
  return true;
}

/**
 * Get demo mode info for logging
 */
export function getDemoModeInfo(): {
  enabled: boolean;
  demoEmailsEnabled: boolean;
  message: string;
} {
  return {
    enabled: DEMO_MODE_ENABLED,
    demoEmailsEnabled: true,
    message: DEMO_MODE_ENABLED
      ? "Demo mode is ENABLED - approvals will be auto-approved"
      : "Demo mode is disabled - use test@/demo@/dev@ emails for auto-approval",
  };
}
