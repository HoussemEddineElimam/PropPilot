export interface Review {
    _id?: string;
    propertyId: string;
    clientId: string;
    rating: number; 
    comment: string;
    createdAt: Date;
  }