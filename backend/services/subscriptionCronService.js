const cron = require("node-cron");
const Subscription = require("../models/Subscription.js");
const Company = require("../models/Company.js");
const { sendSubscriptionNotification, sendSubscriptionExpiredNotification } = require("./emailService.js");

// Check expiring subscriptions daily at 9 AM
const checkExpiringSubscriptions = cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Running daily subscription check...");
    
    const now = new Date();
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
    
    // Find subscriptions expiring within 5 days
    const expiringSubscriptions = await Subscription.find({
      endDate: { $lte: fiveDaysFromNow, $gt: now },
      status: "active"
    }).populate("company").populate("plan");
    
    // Send notifications for each expiring subscription
    for (const subscription of expiringSubscriptions) {
      const daysUntilExpiration = Math.ceil((subscription.endDate - now) / (1000 * 60 * 60 * 24));
      
      await sendSubscriptionNotification(
        subscription.company.manager.reference,
        subscription,
        daysUntilExpiration
      );
    }
    
    // Find expired subscriptions
    const expiredSubscriptions = await Subscription.find({
      endDate: { $lte: now },
      status: "active"
    }).populate("company").populate("plan");
    
    // Update expired subscriptions and send notifications
    for (const subscription of expiredSubscriptions) {
      subscription.status = "expired";
      await subscription.save();
      
      // Update company subscription status
      await Company.findByIdAndUpdate(subscription.company._id, {
        "subscription.status": "expired"
      });
      
      // Send expired notification
      await sendSubscriptionExpiredNotification(
        subscription.company.manager.reference,
        subscription
      );
    }
    
    console.log(`Processed ${expiringSubscriptions.length} expiring and ${expiredSubscriptions.length} expired subscriptions`);
    
  } catch (error) {
    console.error("Error in subscription cron job:", error);
  }
});

// Check subscription status every hour
const checkSubscriptionStatus = cron.schedule("0 * * * *", async () => {
  try {
    console.log("Running hourly subscription status check...");
    
    const now = new Date();
    
    // Find companies with expired subscriptions that haven't been updated
    const expiredCompanies = await Company.find({
      "subscription.endDate": { $lte: now },
      "subscription.status": "active"
    });
    
    for (const company of expiredCompanies) {
      company.subscription.status = "expired";
      await company.save();
      
      console.log(`Updated company ${company.companyName} subscription status to expired`);
    }
    
  } catch (error) {
    console.error("Error in subscription status check:", error);
  }
});

// Start cron jobs
const startSubscriptionCronJobs = () => {
  checkExpiringSubscriptions.start();
  checkSubscriptionStatus.start();
  console.log("Subscription cron jobs started");
};

// Stop cron jobs
const stopSubscriptionCronJobs = () => {
  checkExpiringSubscriptions.stop();
  checkSubscriptionStatus.stop();
  console.log("Subscription cron jobs stopped");
};

module.exports = {
  startSubscriptionCronJobs,
  stopSubscriptionCronJobs
};
