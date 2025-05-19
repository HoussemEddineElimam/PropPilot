export interface Notification {
  _id: string;
  userId: string;
  title: string;
  description: string;
  type : "pending" | "warning" | "success" | "info" ;
  status: "unread" | "read";
  createdAt: Date;
}


