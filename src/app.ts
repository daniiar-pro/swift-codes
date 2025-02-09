import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { json } from "express";
import { router as swiftCodesRouter } from "./routes/swiftCodesRoutes";

dotenv.config();

export default function createApp() {
  const app = express();

  app.use(cors());
  app.use(json());

  app.use("/v1/swift-codes", swiftCodesRouter);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  );
  return app;
}
