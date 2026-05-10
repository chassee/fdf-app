import { ENV } from "./env";

/**
 * Resend email service for parent approval notifications
 * Handles sending branded emails from approval@welcome.crypdawgs.com
 */

interface ResendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface ResendResponse {
  id: string;
  from: string;
  to: string;
  created_at: string;
}

export async function sendResendEmail(options: ResendEmailOptions): Promise<ResendResponse> {
  if (!ENV.resendApiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Future Dawgs Foundation <${ENV.resendFromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${error.message || response.statusText}`);
  }

  const data = (await response.json()) as ResendResponse;
  return data;
}

/**
 * Generate mobile-optimized HTML email for parent approval
 */
export function generateParentApprovalEmail(
  studentName: string,
  approvalLink: string,
  expiresIn: string = "7 days"
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Future Dawgs Foundation - Parent Approval</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #5B8CFF 0%, #7B5CFF 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px 24px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 24px;
      color: #374151;
    }
    .student-name {
      font-weight: 600;
      color: #1f2937;
    }
    .description {
      background-color: #f3f4f6;
      border-left: 4px solid #5B8CFF;
      padding: 16px;
      border-radius: 4px;
      margin: 24px 0;
      font-size: 14px;
      color: #4b5563;
    }
    .description p {
      margin: 0 0 12px 0;
    }
    .description p:last-child {
      margin-bottom: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #5B8CFF 0%, #7B5CFF 100%);
      color: white;
      padding: 14px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(91, 140, 255, 0.3);
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .footer-link {
      color: #5B8CFF;
      text-decoration: none;
    }
    .expires {
      color: #9ca3af;
      font-size: 13px;
      margin-top: 16px;
      font-style: italic;
    }
    @media (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .header {
        padding: 24px 16px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 24px 16px;
      }
      .cta-button {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐕 Future Dawgs Foundation</h1>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hello,
      </div>
      
      <p>
        <span class="student-name">${studentName}</span> has applied to join the Future Dawgs Foundation (FDF), a free, sponsor-funded financial education and skills program for ages 13–17.
      </p>
      
      <div class="description">
        <p><strong>What is FDF?</strong></p>
        <p>FDF is an elite youth academy that teaches real financial intelligence, entrepreneurship, and life skills. Students progress through 4 tiers (Entry → Training → Development → Vault Access) by completing missions, building consistency, and developing discipline.</p>
        <p><strong>Safety First:</strong> All participants require parental approval. We're transparent about curriculum, track progress, and keep families informed.</p>
      </div>
      
      <p>
        To approve <span class="student-name">${studentName}'s</span> participation, please click the button below:
      </p>
      
      <div class="cta-container">
        <a href="${approvalLink}" class="cta-button">Approve Participation</a>
      </div>
      
      <p>
        Or copy and paste this link into your browser:
      </p>
      <p style="word-break: break-all; font-size: 12px; color: #6b7280; background-color: #f3f4f6; padding: 12px; border-radius: 4px;">
        ${approvalLink}
      </p>
      
      <div class="expires">
        This approval link expires in ${expiresIn}.
      </div>
    </div>
    
    <div class="footer">
      <p style="margin: 0 0 12px 0;">
        Questions? Visit <a href="https://futuredawgs.crypdawgs.com/parents" class="footer-link">Parent Information</a>
      </p>
      <p style="margin: 0;">
        © 2026 Future Dawgs Foundation. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
