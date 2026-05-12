import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Load credentials from environment variables only
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}
if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL environment variable is required');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const resend = new Resend(RESEND_API_KEY);
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function sendParentApprovalEmail(
  userId: string,
  parentEmail: string,
  parentName: string,
  studentName: string
) {
  const approvalToken = uuidv4();
  const approvalUrl = `https://fdf.crypdawgs.com/approve?token=${approvalToken}`;

  const { error: updateError } = await supabase
    .from('fdf_users')
    .update({
      approval_token: approvalToken,
      approval_status: 'pending',
      parent_email: parentEmail,
      parent_name: parentName,
    })
    .eq('auth_user_id', userId);

  if (updateError) throw new Error('Failed to update user');

  const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'welcome@welcome.crypdawgs.com';
  const { error: emailError } = await resend.emails.send({
    from: `Future Dawgs Foundation <${RESEND_FROM_EMAIL}>`,
    to: parentEmail,
    subject: `${studentName} Needs Your Approval for Future Dawgs Foundation`,
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;"><h1 style="margin: 0; font-size: 28px;">Future Dawgs Foundation</h1><p style="margin: 10px 0 0 0; opacity: 0.9;">Enrollment Approval Needed</p></div><div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;"><p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${parentName}</strong>,</p><p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">Your child <strong>${studentName}</strong> has signed up for Future Dawgs Foundation, a financial literacy program for ages 13-17.</p><p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">We need your approval to activate their account. Click the button below to approve.</p></div><div style="text-align: center; margin-bottom: 30px;"><a href="${approvalUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Approve Enrollment</a></div><div style="text-align: center; color: #999; font-size: 12px;"><p>Or copy this link: <code>${approvalUrl}</code></p><p>This link expires in 7 days.</p></div></div>`,
  });

  if (emailError) throw new Error('Failed to send email');

  return { success: true, approvalToken, message: 'Approval email sent successfully' };
}
