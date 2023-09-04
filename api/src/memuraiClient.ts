import dotenv from "dotenv";
import { createClient } from "redis";
import logger from "./logger";

dotenv.config();

// connect to memurai
const memuraiClient = createClient({
  url: process.env.MEMURAI_URL ?? "",
});
memuraiClient.on("error", (error) =>
  logger.error("Memurai connection error", error)
);
memuraiClient.on("connect", () => logger.info("Connected to memurai cache"));

(async () => {
  await memuraiClient.connect();
})();

export default memuraiClient;
