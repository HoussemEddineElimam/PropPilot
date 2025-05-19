export interface Booking {
    _id: string;
    propertyId: string;
    clientId: string;
    checkInDate: Date;
    checkOutDate: Date;
    status: "pending" | "confirmed" | "canceled";
    totalAmount: number;
    bookedAt: Date;
  }