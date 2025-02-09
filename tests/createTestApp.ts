// tests/createTestApp.ts
import express from "express";
import { json } from "express";
import { router as swiftCodesRouter } from "../src/routes/swiftCodesRoutes";

export default function createTestApp() {
  const app = express();
  app.use(json());
  app.use("/v1/swift-codes", swiftCodesRouter);
  return app;
}
