import { z } from "zod";
import { ObjectId } from "mongodb";



export const PropertySchema = z
  .object({
    name: z.string().min(2).max(100),
    description: z.string().min(10).max(500),
    country: z.enum(["Algeria", "USA"]),
    state: z.string(),
    city: z.string(), // Province means "City"
    ownerId: z.string().transform((val) => new ObjectId(val)), // Convert string to ObjectId
    images: z.array(z.string().url()).min(1).optional(),
    status: z.enum(["available", "rented", "sold", "inactive"]),
    type: z.enum(["real_estate", "rented_real_estate", "hotel"]),
    category: z.string().min(2).max(50),
    sellPrice: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined), // Transform string to number
    rentPrice: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined), // Transform string to number
    leaseTerm: z.enum(["short-term", "long-term"]).optional(),
    roomCount: z.string().transform((val) => parseInt(val, 10)), // Transform string to number
  })

export type PropertyType = z.infer<typeof PropertySchema>;
