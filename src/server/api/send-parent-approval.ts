import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const resend = new Resend('re_iquUecoJ_HKfE9ux8tw66pQUXRdBEVXtS');
const supabase = createClient(
  'https://jkrwyotrdlucyynnotpd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprcnd5b3RyZGx1Y3l5bm5vdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjM0NzUsImV4cCI6MjA2Njg5OTQ3NX0.NaGZ56xkvIIHj7XjeZbPTg6wHtkvihycvNa4Kzb51FQ',
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

  const { error: emailError } = await resend.emails.send({
    from: 'FDF <noreply@fdf.crypdawgs.com>',
    to: parentEmail,
    subject: 'Approve Your Child\'s FDF Enrollment',
    html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;"><h1 style="margin: 0; font-size: 28px;">Future Dawgs Foundation</h1><p style="margin: 10px 0 0 0; opacity: 0.9;">Enrollment Approval Needed</p></div><div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;"><p style="margin: 0 0 15px 0; color: #333; font-size: 16px;">Hi <strong>${parentName}</strong>,</p><p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">Your child <strong>${studentName}</strong> has signed up for Future Dawgs Foundation, a financial literacy program for ages 13-17.</p><p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">We need your approval to activate their account.</p></div><div style="text-align: center; margin-bottom: 30px;"><a href="${approvalUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600;">Approve Enrollment</a></div></div>`,
  });

  if (emailError) throw new Error('Failed to send email');

  return { success: true, approvalToken };
}
