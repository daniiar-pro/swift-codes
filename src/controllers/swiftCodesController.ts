// src/controllers/swiftCodesController.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { db } from '../database';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';

// Schema to validate incoming POST requests
const createSwiftCodeSchema = z.object({
  address: z.string(),
  bankName: z.string(),
  countryISO2: z.string(),
  countryName: z.string(),
  isHeadquarter: z.boolean(),
  swiftCode: z.string()
});

export const getSwiftCodeDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { swiftCode } = req.params;
  try {
    const record = await db.selectFrom('swift_codes')
      .selectAll()
      .where('swift_code', '=', swiftCode)
      .executeTakeFirst();
    
    if (!record) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Swift code not found' });
      return;
    }

    // If the record is a headquarter, include its associated branches
    if (record.is_headquarter === 1) {
      const branches = await db.selectFrom('swift_codes')
        .select(['swift_code', 'bank_name', 'address', 'country_iso2', 'is_headquarter'])
        .where('code_prefix', '=', record.code_prefix)
        .where('swift_code', '!=', record.swift_code)
        .execute();
      
      const response = {
        address: record.address,
        bankName: record.bank_name,
        countryISO2: record.country_iso2,
        countryName: record.country_name,
        isHeadquarter: Boolean(record.is_headquarter),
        swiftCode: record.swift_code,
        branches: branches.map(branch => ({
          address: branch.address,
          bankName: branch.bank_name,
          countryISO2: branch.country_iso2,
          isHeadquarter: Boolean(branch.is_headquarter),
          swiftCode: branch.swift_code
        }))
      };
      res.json(response);
      return;
    } else {
      // For branch swift codes, simply return the record details
      const response = {
        address: record.address,
        bankName: record.bank_name,
        countryISO2: record.country_iso2,
        countryName: record.country_name,
        isHeadquarter: Boolean(record.is_headquarter),
        swiftCode: record.swift_code
      };
      res.json(response);
      return;
    }
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    return;
  }
};

export const getSwiftCodesByCountry: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { countryISO2code } = req.params;
  try {
    const records = await db.selectFrom('swift_codes')
      .selectAll()
      .where('country_iso2', '=', countryISO2code.toUpperCase())
      .execute();
    
    if (records.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'No swift codes found for this country' });
      return;
    }

    const countryName = records[0].country_name;
    const swiftCodes = records.map(record => ({
      address: record.address,
      bankName: record.bank_name,
      countryISO2: record.country_iso2,
      isHeadquarter: Boolean(record.is_headquarter),
      swiftCode: record.swift_code
    }));

    const response = {
      countryISO2: countryISO2code.toUpperCase(),
      countryName,
      swiftCodes
    };

    res.json(response);
    return;
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    return;
  }
};

export const createSwiftCode: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsedData = createSwiftCodeSchema.parse(req.body);
    const { address, bankName, countryISO2, countryName, isHeadquarter, swiftCode } = parsedData;
    
    const record = {
      swift_code: swiftCode.trim(),
      bank_name: bankName.trim(),
      address: address.trim(),
      country_iso2: countryISO2.toUpperCase().trim(),
      country_name: countryName.toUpperCase().trim(),
      is_headquarter: isHeadquarter ? 1 : 0,
      code_prefix: swiftCode.substring(0, 8)
    };

    await db.insertInto('swift_codes').values(record).execute();

    res.status(StatusCodes.CREATED).json({ message: 'Swift code created successfully' });
    return;
  } catch (error: any) {
    console.error(error);
    if (error.name === 'ZodError') {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.errors });
      return;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    return;
  }
};

export const deleteSwiftCode: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { swiftCode } = req.params;
  try {
    const result = await db.deleteFrom('swift_codes')
      .where('swift_code', '=', swiftCode)
      .executeTakeFirst();

    // Convert numDeletedRows to number before comparing to 0 (it might be returned as bigint)
    if (!result || Number(result.numDeletedRows) === 0) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Swift code not found' });
      return;
    }
    
    res.json({ message: 'Swift code deleted successfully' });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    return;
  }
};