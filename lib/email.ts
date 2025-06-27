// lib/email.ts
import nodemailer from "nodemailer";
import { calculateProfileCompletion } from "./profile-completion";

export async function sendReminderEmail(user: any) {
  if (!process.env.MAIL_FROM || !process.env.MAIL_PASS) return;
  const completion = await calculateProfileCompletion(user._id.toString());

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Business Support <${process.env.MAIL_FROM}>`,
    to: user.email,
    subject: "Complete Your Business Profile",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Complete Your Business Profile</h2>
      
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p>Your profile is <strong>${completion}% complete</strong>. Just a few more steps to start receiving job requests!</p>
        <div style="margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
            <span>Profile Completion</span>
            <span>${completion}%</span>
          </div>
          <div style="height: 8px; background-color: #e5e7eb; border-radius: 4px; margin-top: 5px; overflow: hidden;">
            <div style="height: 100%; width: ${completion}%; background-color: #3b82f6;"></div>
          </div>
        </div>
      </div>
      
      <p>Complete these sections to finish your profile:</p>
      <ul style="padding-left: 20px;">
        ${completion < 20 ? "<li>Add your business name and ABN</li>" : ""}
        ${completion < 40 ? "<li>Select services you offer</li>" : ""}
        ${completion < 55 ? "<li>Specify your service areas</li>" : ""}
        ${completion < 65 ? "<li>Add your operating hours</li>" : ""}
        ${completion < 75 ? "<li>Write a business description</li>" : ""}
        ${completion < 90 ? "<li>Add licenses or certifications</li>" : ""}
      </ul>
      
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
         style="display: inline-block; background-color: #2563eb; color: white; 
                padding: 12px 24px; text-decoration: none; border-radius: 4px;
                font-weight: bold; margin: 20px 0;">
        Complete Your Profile
      </a>
      
      <p style="font-size: 0.9rem; color: #6b7280;">
        This is reminder #${(user.remindersSent || 0) + 1} of 3. 
        You'll stop receiving these once your profile is complete.
      </p>
    </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
