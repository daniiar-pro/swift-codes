import request from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import createTestDatabase from "./createTestDatabase";
import createTestApp from "./createTestApp";
import { setDbInstance } from "../src/modules/repository";

let db: Awaited<ReturnType<typeof createTestDatabase>>;
let app: ReturnType<typeof createTestApp>;

beforeEach(async () => {
  db = await createTestDatabase();
  setDbInstance(db);
  app = createTestApp();
});

afterEach(async () => {
  await db.destroy();
});

describe("Swift Codes API Routes", () => {
  describe("GET /v1/swift-codes", () => {
    it("should return initial 5 swift codes for better UX", async () => {
      const testRecords = [
        {
          swift_code: "AAA111XXX",
          bank_name: "Bank A",
          address: "Address A",
          country_iso2: "US",
          country_name: "USA",
          is_headquarter: 1,
          code_prefix: "AAA111XX",
        },
        {
          swift_code: "BBB222XXX",
          bank_name: "Bank B",
          address: "Address B",
          country_iso2: "US",
          country_name: "USA",
          is_headquarter: 1,
          code_prefix: "BBB222XX",
        },
        {
          swift_code: "CCC333XXX",
          bank_name: "Bank C",
          address: "Address C",
          country_iso2: "US",
          country_name: "USA",
          is_headquarter: 1,
          code_prefix: "CCC333XX",
        },
        {
          swift_code: "DDD444XXX",
          bank_name: "Bank D",
          address: "Address D",
          country_iso2: "US",
          country_name: "USA",
          is_headquarter: 1,
          code_prefix: "DDD444XX",
        },
        {
          swift_code: "EEE555XXX",
          bank_name: "Bank E",
          address: "Address E",
          country_iso2: "US",
          country_name: "USA",
          is_headquarter: 1,
          code_prefix: "EEE555XX",
        },
      ];
      await db.insertInto("swift_codes").values(testRecords).execute();

      const res = await request(app).get("/v1/swift-codes");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(5);
      expect(res.body[0].swift_code).toBe("AAA111XXX");
    });

    it("should return 500 if no data is available", async () => {
      const res = await request(app).get("/v1/swift-codes");
      expect(res.status).toBe(500);
      expect(res.body.message).toBe(
        "Something went wrong! try again later! Internal Server Error"
      );
    });
  });

  describe("GET /v1/swift-codes/:swiftCode", () => {
    it("should return swift code details for a branch record", async () => {
      const record = {
        swift_code: "BRANCH001",
        bank_name: "Branch Bank",
        address: "Branch Address",
        country_iso2: "CA",
        country_name: "CANADA",
        is_headquarter: 0,
        code_prefix: "BRANCH00",
      };
      await db.insertInto("swift_codes").values(record).execute();

      const res = await request(app).get("/v1/swift-codes/BRANCH001");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        address: "Branch Address",
        bankName: "Branch Bank",
        countryISO2: "CA",
        countryName: "CANADA",
        isHeadquarter: false,
        swiftCode: "BRANCH001",
      });
    });

    it("should return swift code details with branches for a headquarter record", async () => {
      const hq = {
        swift_code: "HQ001001XXX",
        bank_name: "HQ Bank",
        address: "HQ Address",
        country_iso2: "GB",
        country_name: "UNITED KINGDOM",
        is_headquarter: 1,
        code_prefix: "HQ001001XXX".substring(0, 8),
      };
      await db.insertInto("swift_codes").values(hq).execute();

      const branch = {
        swift_code: "HQ001001TIP",
        bank_name: "HQ Branch",
        address: "Branch Address",
        country_iso2: "GB",
        country_name: "UNITED KINGDOM",
        is_headquarter: 0,
        code_prefix: hq.swift_code.substring(0, 8),
      };
      await db.insertInto("swift_codes").values(branch).execute();

      const res = await request(app).get("/v1/swift-codes/HQ001001XXX");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        address: "HQ Address",
        bankName: "HQ Bank",
        countryISO2: "GB",
        countryName: "UNITED KINGDOM",
        isHeadquarter: true,
        swiftCode: "HQ001001XXX",
        branches: [
          {
            address: "Branch Address",
            bankName: "HQ Branch",
            countryISO2: "GB",
            isHeadquarter: false,
            swiftCode: "HQ001001TIP",
          },
        ],
      });
    });
  });

  describe("GET /v1/swift-codes/country/:countryISO2code", () => {
    it("should return swift codes for a given country", async () => {
      const testRecords = [
        {
          swift_code: "US001XXX",
          bank_name: "Bank US1",
          address: "Address US1",
          country_iso2: "US",
          country_name: "USA",
          is_headquarter: 1,
          code_prefix: "US001XX",
        },
        {
          swift_code: "US002XXX",
          bank_name: "Bank US2",
          address: "Address US2",
          country_iso2: "US",
          country_name: "USA",
          is_headquarter: 0,
          code_prefix: "US002XX",
        },
      ];
      await db.insertInto("swift_codes").values(testRecords).execute();

      const res = await request(app).get("/v1/swift-codes/country/us");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        countryISO2: "US",
        countryName: "USA",
        swiftCodes: [
          {
            address: "Address US1",
            bankName: "Bank US1",
            countryISO2: "US",
            isHeadquarter: true,
            swiftCode: "US001XXX",
          },
          {
            address: "Address US2",
            bankName: "Bank US2",
            countryISO2: "US",
            isHeadquarter: false,
            swiftCode: "US002XXX",
          },
        ],
      });
    });

    it("should return 404 if no records found for country", async () => {
      const res = await request(app).get("/v1/swift-codes/country/XX");
      expect(res.status).toBe(404);
      expect(res.body.message).toContain(
        "No swift codes found for Country ISO2 code: XX"
      );
    });
  });

  describe("POST /v1/swift-codes", () => {
    it("should create a new swift code record", async () => {
      const newRecord = {
        address: "New Address",
        bankName: "New Bank",
        countryISO2: "AU",
        countryName: "Australia",
        isHeadquarter: true,
        swiftCode: "NEW001XXX",
      };

      const res = await request(app).post("/v1/swift-codes").send(newRecord);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Swift code added successfully");
      expect(res.body.record).toEqual({
        swift_code: "NEW001XXX",
        bank_name: "New Bank",
        address: "New Address",
        country_iso2: "AU",
        country_name: "AUSTRALIA",
        is_headquarter: 1,
        code_prefix: "NEW001XX",
      });
    });

    it("should return 409 if swift code already exists", async () => {
      const newRecord = {
        address: "New Address",
        bankName: "New Bank",
        countryISO2: "AU",
        countryName: "Australia",
        isHeadquarter: true,
        swiftCode: "DUPLICATE001",
      };

      await db
        .insertInto("swift_codes")
        .values({
          swift_code: "DUPLICATE001",
          bank_name: "Existing Bank",
          address: "Existing Address",
          country_iso2: "AU",
          country_name: "AUSTRALIA",
          is_headquarter: 1,
          code_prefix: "DUPLICAT",
        })
        .execute();

      const res = await request(app).post("/v1/swift-codes").send(newRecord);
      expect(res.status).toBe(409);
      expect(res.body.message).toContain("already exists");
    });
  });

  describe("DELETE /v1/swift-codes/:swiftCode", () => {
    it("should delete a swift code record", async () => {
      await db
        .insertInto("swift_codes")
        .values({
          swift_code: "DELETE001",
          bank_name: "Delete Bank",
          address: "Delete Address",
          country_iso2: "FR",
          country_name: "FRANCE",
          is_headquarter: 1,
          code_prefix: "DELETE00",
        })
        .execute();

      const res = await request(app).delete("/v1/swift-codes/DELETE001");
      expect(res.status).toBe(200);
      expect(res.body.message).toContain("deleted successfully");
    });

    it("should return 404 if swift code not found for deletion", async () => {
      const res = await request(app).delete("/v1/swift-codes/NONEXISTENT");
      expect(res.status).toBe(404);
      expect(res.body.message).toContain("not found");
    });
  });
});
