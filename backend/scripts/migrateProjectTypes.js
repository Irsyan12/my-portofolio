import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";

dotenv.config();

async function main() {
  if (!process.env.MONGO_URI) {
    console.error(
      "Please set MONGO_URI in your environment (.env) before running this script."
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DBNAME,
  });
  console.log("Connected to MongoDB for migration");

  try {
    // 1) Convert likely certifications to type: 'certification'
    const certMatch = {
      $and: [
        {
          $or: [{ type: { $exists: false } }, { type: "project" }],
        },
        {
          $or: [
            { certificateInstitution: { $exists: true, $ne: "" } },
            { certificateLink: { $exists: true, $ne: "" } },
            { imageUrl: { $exists: true, $ne: "" } },
            {
              shortDescription: {
                $regex: "certif|certificate|coursera",
                $options: "i",
              },
            },
          ],
        },
      ],
    };

    const certResult = await Project.updateMany(certMatch, {
      $set: { type: "certification" },
    });
    console.log(
      `Matched ${certResult.matchedCount}, modified ${certResult.modifiedCount} documents set to type='certification'`
    );

    // 2) Set remaining documents with missing `type` to 'project' (safe default)
    const missingTypeResult = await Project.updateMany(
      { type: { $exists: false } },
      { $set: { type: "project" } }
    );
    console.log(
      `Set ${missingTypeResult.modifiedCount} documents with missing 'type' to 'project'`
    );

    console.log("Migration finished.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    mongoose.connection.close();
  }
}

main();
