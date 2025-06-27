// lib/cron.ts
import cron from "node-cron";
import User from "@/models/user";
import { sendReminderEmail } from "./email";
import { isProfileComplete } from "./profile-completion";

// Run daily at 10:00 AM
cron.schedule("0 10 * * *", async () => {
  try {
    console.log("Running profile reminder job...");

    // Find users with incomplete profiles who need reminders
    const users = await User.find({
      $or: [
        { lastReminderSent: null },
        {
          lastReminderSent: {
            $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
        },
      ],
      remindersSent: { $lt: 3 },
    });

    for (const user of users) {
      // Check if profile is actually complete
      const profileComplete = await isProfileComplete(user._id.toString());

      if (profileComplete) {
        // Update user status if now complete
        user.profileComplete = true;
        user.lastReminderSent = null;
        user.remindersSent = 0;
        await user.save();
        console.log(`Profile marked complete for: ${user.email}`);
        continue;
      }

      // Only send reminder if still incomplete
      await sendReminderEmail(user);

      // Update reminder tracking
      user.lastReminderSent = new Date();
      user.remindersSent = (user.remindersSent || 0) + 1;
      await user.save();

      console.log(`Sent reminder to: ${user.email}`);
    }

    console.log(`Sent ${users.length} reminders`);
  } catch (error) {
    console.error("Reminder job failed:", error);
  }
});

export function startCronJobs() {
  console.log("Cron jobs started");
}
