export default interface Transaction {
  _id: string;
  payerId: string;
  payerName: string;
  receiverId: string;
  receiverName?: string;
  propertyId: string;
  propertyName: string;
  amount: number;
  currency: string;
  type: "rent" | "deposit" | "sale" | "penalty";
  date: Date;
  status: "pending" | "completed" | "failed";
  paymentMethod: "credit_card" | "bank_transfer" | "paypal";
}
