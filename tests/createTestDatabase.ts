import { Kysely, SqliteDialect } from "kysely";
import Database from "better-sqlite3";
import { DatabaseSchema } from "../src/database";

export default async function createTestDatabase() {
  const db = new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: new Database(":memory:"),
    }),
  });

  await db.schema
    .createTable("swift_codes")
    .ifNotExists()
    .addColumn("swift_code", "text", (col) => col.primaryKey())
    .addColumn("bank_name", "text", (col) => col.notNull())
    .addColumn("address", "text", (col) => col.notNull())
    .addColumn("country_iso2", "text", (col) => col.notNull())
    .addColumn("country_name", "text", (col) => col.notNull())
    .addColumn("is_headquarter", "integer", (col) => col.notNull())
    .addColumn("code_prefix", "text", (col) => col.notNull())
    .execute();

  return db;
}
