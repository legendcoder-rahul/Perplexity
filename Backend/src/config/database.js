import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;
