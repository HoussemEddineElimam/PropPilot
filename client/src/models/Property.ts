export interface Property {
  _id: string;  
  name?: string;  
  description?: string;
  country?: string;
  state?: string;
  city?: string;
  ownerId: string; 
  images?: string[];  
  status?: "available" | "rented" | "sold" | "inactive";
  type?: "real_estate" | "rented_real_estate" | "hotel";
  category?: string;
  sellPrice?: number;
  rentPrice?: number;
  leaseTerm?: "short-term" | "long-term";
  roomCount?: number;
  bathrooms?: number;
  bedrooms?: number;
  yearBuilt?: number;
  livingAreaSqft?: number;
  propertyTaxRate?: number;
  createdAt: Date;
  updatedAt?: Date;
  transactionIds?: string[];  
  maintenanceRequestIds?: string[];  
  leaseIds?: string[]; 
  bookingIds?: string[];  
  ownerName?: string; 
}
