import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";
import { router as swiftCodesRouter } from "../src/routes/swiftCodesRoutes";

const app = express();
app.use(express.json());
app.use("/v1/swift-codes", swiftCodesRouter);

describe("SWIFT Codes API", () => {
  it("should return 404 for a non-existent swift code", async () => {
    const res = await request(app).get("/v1/swift-codes/INVALID_CODE");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Swift code not found");
  });
});
