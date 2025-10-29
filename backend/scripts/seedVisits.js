import mongoose from "mongoose";
import dotenv from "dotenv";
import Visit from "../models/Visit.js";

dotenv.config();

const seedVisits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding visits...");

    // Clear existing visits (optional)
    // await Visit.deleteMany({});
    // console.log("Cleared existing visits");

    // Generate visits for the last 30 days
    const visits = [];
    const now = new Date();
    const pages = ["/", "/projects", "/about", "/contact"];
    const devices = ["desktop", "mobile", "tablet"];
    const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
    const os = ["Windows", "MacOS", "Linux", "iOS", "Android"];

    // Generate 500-1000 visits over 30 days
    const totalVisits = Math.floor(Math.random() * 500) + 500;

    for (let i = 0; i < totalVisits; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);

      const visitDate = new Date(now);
      visitDate.setDate(visitDate.getDate() - daysAgo);
      visitDate.setHours(visitDate.getHours() - hoursAgo);
      visitDate.setMinutes(visitDate.getMinutes() - minutesAgo);

      visits.push({
        ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}.${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}`,
        userAgent: `Mozilla/5.0 (${
          os[Math.floor(Math.random() * os.length)]
        }) ${browsers[Math.floor(Math.random() * browsers.length)]}`,
        page: pages[Math.floor(Math.random() * pages.length)],
        referrer:
          Math.random() > 0.5
            ? "https://google.com"
            : Math.random() > 0.5
            ? "https://github.com"
            : "direct",
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        os: os[Math.floor(Math.random() * os.length)],
        sessionId: `session_${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}`,
        duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
        createdAt: visitDate,
        updatedAt: visitDate,
      });
    }

    // Insert visits in batches
    const batchSize = 100;
    for (let i = 0; i < visits.length; i += batchSize) {
      const batch = visits.slice(i, i + batchSize);
      await Visit.insertMany(batch);
      console.log(
        `Inserted batch ${Math.floor(i / batchSize) + 1} (${
          batch.length
        } visits)`
      );
    }

    console.log(`✅ Successfully seeded ${visits.length} visits!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding visits:", error);
    process.exit(1);
  }
};

seedVisits();
