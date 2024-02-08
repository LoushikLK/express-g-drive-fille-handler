import { connect } from "mongoose";
import logger from "./logger.service";

/**
 * Asynchronously connects to the database using the MONGODB_URI environment variable.
 */
export default async function connectToDb() {
  try {
    // Connect to the database
    await connect(process.env.MONGODB_URI as string);
    logger.info("Database connected");
  } catch (error) {
    // Log any connection errors
    logger.error(error instanceof Error ? error.message : error);
  }
}
