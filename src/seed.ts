// src/seed.ts
import * as XLSX from 'xlsx';
import { db } from './database';
import path from 'path';

async function createTable() {
  await db.schema
    .createTable('swift_codes')
    .ifNotExists()
    .addColumn('swift_code', 'text', col => col.primaryKey())
    .addColumn('bank_name', 'text', col => col.notNull())
    .addColumn('address', 'text', col => col.notNull())
    .addColumn('country_iso2', 'text', col => col.notNull())
    .addColumn('country_name', 'text', col => col.notNull())
    .addColumn('is_headquarter', 'integer', col => col.notNull())
    .addColumn('code_prefix', 'text', col => col.notNull())
    .execute();
}

function parseExcel() {
  const filePath = path.join(__dirname, '..', 'data', 'swift_codes.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  // Use a generic type to let TypeScript know the rows are records
  const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName], { defval: '' });
  return jsonData;
}
// "bank_name": "Emilbek Valisher",

async function seed() {
  try {
    await createTable();
    const data = parseExcel();

    for (const row of data) {
      // The Excel columns (case-sensitive) are:
      // "COUNTRY ISO2 CODE" | "SWIFT CODE" | "CODE TYPE" | "NAME" | "ADDRESS" | "TOWN NAME" | "COUNTRY NAME" | "TIME ZONE"
      const countryISO2 = String(row["COUNTRY ISO2 CODE"]).toUpperCase();
      const swiftCode = String(row["SWIFT CODE"]).trim();
      const bankName = String(row["NAME"]).trim();
      const address = String(row["ADDRESS"]).trim();
      const town = String(row["TOWN NAME"]).trim();
      const fullAddress = town ? `${address}, ${town}` : address;
      const countryName = String(row["COUNTRY NAME"]).toUpperCase();
      const isHeadquarter = swiftCode.endsWith("XXX");
      const codePrefix = swiftCode.substring(0, 8);

      try {
        await db.insertInto('swift_codes').values({
          swift_code: swiftCode,
          bank_name: bankName,
          address: fullAddress,
          country_iso2: countryISO2,
          country_name: countryName,
          is_headquarter: isHeadquarter ? 1 : 0,
          code_prefix: codePrefix
        }).execute();
      } catch (error: any) {
        console.error(`Error inserting swift code ${swiftCode}:`, error.message);
      }
    }
    console.log('Seeding completed.');
  } catch (error: any) {
    console.error('Seeding error:', error);
  } finally {
    await db.destroy();
  }
}

seed();