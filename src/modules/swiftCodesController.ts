import { Request, Response, NextFunction, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import buildswiftCodesRepository from "./repository";
import { createSwiftCodeSchema } from "./schema";
import BadRequest from "../utils/errors/BadRequest";

const swiftCodesRepository = buildswiftCodesRepository();

export const displaySomeInitialDataForBetterUX: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const initialContents = await swiftCodesRepository.displaySomeInitialData();

  if (!initialContents || initialContents.length === 0) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong! try again later! Internal Server Error",
    });
    return;
  }

  res.json(initialContents);
  return;
};

export const getSwiftCodeDetails: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { swiftCode } = req.params;

  if (!swiftCode) {
    throw new BadRequest("Provide swift code");
  }

  try {
    const record = await swiftCodesRepository.getDetailsBySwiftCode(swiftCode);

    if (!record) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Details not found for swift code: ${swiftCode}` });
      return;
    }

    if (record.is_headquarter === 1) {
      const codePrefix = record.code_prefix;
      const swiftCode = record.swift_code;

      const branches = await swiftCodesRepository.getBranches(
        codePrefix,
        swiftCode
      );

      const response = {
        address: record.address,
        bankName: record.bank_name,
        countryISO2: record.country_iso2,
        countryName: record.country_name,
        isHeadquarter: Boolean(record.is_headquarter),
        swiftCode: record.swift_code,
        branches: branches.map((branch) => ({
          address: branch.address,
          bankName: branch.bank_name,
          countryISO2: branch.country_iso2,
          isHeadquarter: Boolean(branch.is_headquarter),
          swiftCode: branch.swift_code,
        })),
      };
      res.json(response);
      return;
    } else {
      const response = {
        address: record.address,
        bankName: record.bank_name,
        countryISO2: record.country_iso2,
        countryName: record.country_name,
        isHeadquarter: Boolean(record.is_headquarter),
        swiftCode: record.swift_code,
      };
      res.json(response);
      return;
    }
  } catch (error: any) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const getSwiftCodesByCountry: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { countryISO2code } = req.params;

  try {
    const records = await swiftCodesRepository.getByCountry(countryISO2code);

    if (records.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: `No swift codes found for Country ISO2 code: ${countryISO2code}`,
      });
      return;
    }

    const countryName = records[0].country_name;
    const swiftCodes = records.map((record) => ({
      address: record.address,
      bankName: record.bank_name,
      countryISO2: record.country_iso2,
      isHeadquarter: Boolean(record.is_headquarter),
      swiftCode: record.swift_code,
    }));

    const response = {
      countryISO2: countryISO2code.toUpperCase(),
      countryName,
      swiftCodes,
    };

    res.json(response);
    return;
  } catch (error: any) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const createSwiftCode: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedData = createSwiftCodeSchema.parse(req.body);

    const {
      address,
      bankName,
      countryISO2,
      countryName,
      isHeadquarter,
      swiftCode,
    } = parsedData;

    const existingRecord =
      await swiftCodesRepository.findBySwiftCode(swiftCode);
    if (existingRecord) {
      res.status(StatusCodes.CONFLICT).json({
        message: `Details with ${swiftCode} already exists, you can't add new details with the same swift code, swift codes should be unique`,
      });
      return;
    }

    const record = {
      swift_code: swiftCode.trim(),
      bank_name: bankName.trim(),
      address: address.trim(),
      country_iso2: countryISO2.toUpperCase().trim(),
      country_name: countryName.toUpperCase().trim(),
      is_headquarter: isHeadquarter ? 1 : 0,
      code_prefix: swiftCode.substring(0, 8),
    };

    await swiftCodesRepository.addNewSwiftCode(record);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Swift code added successfully", record });
    return;
  } catch (error: any) {
    console.error(error);
    if (error.name === "ZodError") {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Fill all the required inputs, see example below",

        example: {
          address: "UL Paradise 7",
          bankName: "Heaven Bank",
          countryISO2: "KG",
          countryName: "Kyrgyzstan",
          isHeadquarter: true || false,
          swiftCode: "FHLELGXX",
        },
      });
      return;
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};

export const deleteSwiftCode: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { swiftCode } = req.params;
  try {
    const result = await swiftCodesRepository.deleteSwiftCodeFromDB(swiftCode);

    if (!result || Number(result.numDeletedRows) === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Swift code ${swiftCode} not found` });
      return;
    }

    res.json({ message: `Swift code ${swiftCode} deleted successfully` });
    return;
  } catch (error: any) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
  }
};
