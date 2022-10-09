import mongoose from "mongoose";

export const connectDB = async () => {
  console.log("Attempting DB connection");
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log("Db connection error", error);
    console.log("Failed to connect db".red.bold);
  }
};
