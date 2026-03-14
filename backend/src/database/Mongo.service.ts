import { connect } from "mongoose";

export const mongoService = async () => {
  try {
    if (!Bun.env.MONGO_URL)
      throw new Error("MONGO_URL is not defined in the environment variables");

    const request = await connect(Bun.env.MONGO_URL as string);

    if (request) return console.log("Connection is successfully!!");
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
