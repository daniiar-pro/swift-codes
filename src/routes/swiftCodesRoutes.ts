// src/routes/swiftCodesRoutes.ts
import { Router } from 'express';
import {
  getSwiftCodesByCountry,
  getSwiftCodeDetails,
  createSwiftCode,
  deleteSwiftCode
} from '../controllers/swiftCodesController';

export const router = Router();

// GET all SWIFT codes for a given country
router.get('/country/:countryISO2code', getSwiftCodesByCountry);

// GET details for a single SWIFT code
router.get('/:swiftCode', getSwiftCodeDetails);

// POST a new SWIFT code entry
router.post('/', createSwiftCode);

// DELETE a SWIFT code entry
router.delete('/:swiftCode', deleteSwiftCode);