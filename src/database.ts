import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import dotenv from 'dotenv';

// 0|swift_code|TEXT|0||1
// 1|bank_name|TEXT|1||0
// 2|address|TEXT|1||0
// 3|country_iso2|TEXT|1||0
// 4|country_name|TEXT|1||0
// 5|is_headquarter|INTEGER|1||0
// 6|code_prefix|TEXT|1||0

dotenv.config();

export interface SwiftCode {
  swift_code: string;
  bank_name: string;
  address: string;
  country_iso2: string;
  country_name: string;
  is_headquarter: number; // Stored as 1 (true) or 0 (false)
  code_prefix: string;
}

export interface DatabaseSchema {
  swift_codes: SwiftCode;
}

export const db = new Kysely<DatabaseSchema>({
  dialect: new SqliteDialect({
    database: new Database(process.env.DB_PATH || './data/database.sqlite')
  })
});