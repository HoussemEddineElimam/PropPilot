export interface Lease {
    _id: string;
    propertyId: string;
    clientId: string;
    startDate: Date;
    endDate: Date;
    status: "active" | "pending" | "terminated";
    rentAmount: number;
  }