import { connect } from "mongoose";

export default async function connectToDb() {
  try {
    await connect(process.env.MONGODB_URI as string);
    console.log("Database connected");
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
  }
}
