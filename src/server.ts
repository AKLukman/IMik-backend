import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import seedSuperAdmin from "./app/DB";
import * as dns from "node:dns";
import app from "./app";

let server: Server;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
