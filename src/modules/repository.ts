import { db as defaultDb, SwiftCode } from "../database";

const TABLE_SWIFT_CODES = "swift_codes";

let _db = defaultDb;

export const setDbInstance = (dbInstance: typeof defaultDb) => {
  _db = dbInstance;
};

export default () => ({
  displaySomeInitialData: async () => {
    return await _db
      .selectFrom(TABLE_SWIFT_CODES)
      .selectAll()
      .orderBy("swift_code", "asc")
      .limit(5)
      .execute();
  },
  getDetailsBySwiftCode: async (swiftCode: string) => {
    return await _db
      .selectFrom(TABLE_SWIFT_CODES)
      .selectAll()
      .where("swift_code", "=", swiftCode)
      .executeTakeFirst();
  },
  getBranches: async (codePrefix: string, swiftCode: string) => {
    return await _db
      .selectFrom(TABLE_SWIFT_CODES)
      .select([
        "swift_code",
        "bank_name",
        "address",
        "country_iso2",
        "is_headquarter",
      ])
      .where("code_prefix", "=", codePrefix)
      .where("swift_code", "!=", swiftCode)
      .execute();
  },
  getByCountry: async (countryISO2code: string) => {
    return await _db
      .selectFrom(TABLE_SWIFT_CODES)
      .selectAll()
      .where("country_iso2", "=", countryISO2code.toUpperCase())
      .execute();
  },
  findBySwiftCode: async (swifCode: string): Promise<SwiftCode | undefined> => {
    return await _db
      .selectFrom(TABLE_SWIFT_CODES)
      .selectAll()
      .where("swift_code", "=", swifCode)
      .executeTakeFirst();
  },
  addNewSwiftCode: async (record: SwiftCode) => {
    return await _db.insertInto(TABLE_SWIFT_CODES).values(record).execute();
  },
  deleteSwiftCodeFromDB: async (swiftCode: string) => {
    return await _db
      .deleteFrom(TABLE_SWIFT_CODES)
      .where("swift_code", "=", swiftCode)
      .executeTakeFirst();
  },
});
