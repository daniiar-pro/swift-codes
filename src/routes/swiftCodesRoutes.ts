import { Router } from "express";
import {
  getSwiftCodesByCountry,
  getSwiftCodeDetails,
  createSwiftCode,
  deleteSwiftCode,
  displaySomeInitialDataForBetterUX,
} from "../modules/swiftCodesController";

export const router = Router();

// Displaying initial 5 swift code (and details for  / path, since its better than displaying nothing when page initially loads)

router.get("/", displaySomeInitialDataForBetterUX);

//  Get details By Swift Code
router.get("/:swiftCode", getSwiftCodeDetails);

// Get detail By Country
router.get("/country/:countryISO2code", getSwiftCodesByCountry);

//  Add new swift code (and details)
router.post("/", createSwiftCode);

//  Delete swift code (and details)
router.delete("/:swiftCode", deleteSwiftCode);
