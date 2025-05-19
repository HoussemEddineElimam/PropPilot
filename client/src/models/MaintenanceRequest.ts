export interface MaintenanceRequest {
    _id: string;
    propertyId: string;
    clientId: string;
    description: string;
    status: "pending" | "in-progress" | "resolved";
    reportedAt: Date;
  }