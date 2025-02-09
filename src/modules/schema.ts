import { z } from 'zod'
 
export const createSwiftCodeSchema = z.object({
  address: z.string(),
  bankName: z.string(),
  countryISO2: z.string(),
  countryName: z.string(),
  isHeadquarter: z.boolean(),
  swiftCode: z.string(),
});