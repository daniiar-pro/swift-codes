import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import dotenv from "dotenv";

dotenv.config();

export interface SwiftCode {
  swift_code: string;
  bank_name: string;
  address: string;
  country_iso2: string;
  country_name: string;
  is_headquarter: number;
  code_prefix: string;
}

export interface DatabaseSchema {
  swift_codes: SwiftCode;
}

export const db = new Kysely<DatabaseSchema>({
  dialect: new SqliteDialect({
    database: new Database(process.env.DB_PATH || "./data/database.sqlite"),
  }),
});
