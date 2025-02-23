import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || "defaultSecret",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/chat",
};
