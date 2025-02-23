import mongoose from "mongoose";
import { config } from "./env";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("✅ MongoDB Connected!");
    } catch (error) {
        console.log("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};
