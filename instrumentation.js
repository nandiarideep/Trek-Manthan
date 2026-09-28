import { connectDB } from "./lib/db";

export async function register() {
  await connectDB();
}