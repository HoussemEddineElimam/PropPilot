import { ObjectId } from "mongodb";
import { Entity, ObjectIdColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Property {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  country?: string;

  @Column()
  state?: string;

  @Column()
  city?: string;

  @Column()
  ownerId!: ObjectId;

  @Column("array", { default: [] })
  images?: string[];

  @Column()
  status?: "available" | "rented" | "sold" | "inactive"; 

  @Column()
  type?: "real_estate" | "rented_real_estate" | "hotel"; 

  @Column()
  category?: string;

  @Column({ nullable: true })
  sellPrice?: number;

  @Column({ nullable: true })
  rentPrice?: number;

  @Column({ nullable: true })
  leaseTerm?: "short-term" | "long-term";

  @Column({ nullable: true })
  roomCount?: number;

  @Column({ nullable: true })
  bathrooms?: number;

  @Column({ nullable: true })
  bedrooms?: number;

  @Column({ nullable: true })
  yearBuilt?: number;

  @Column({ nullable: true })
  livingAreaSqft?: number;

  @Column({ nullable: true })
  propertyTaxRate?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ nullable: true, type: "date" })
  updatedAt?: Date;

  @Column("array", { default: [] })
  transactionIds?: ObjectId[];

  @Column("array", { default: [] })
  maintenanceRequestIds?: ObjectId[];

  @Column("array", { default: [] })
  leaseIds?: ObjectId[];

  @Column("array", { default: [] })
  bookingIds?: ObjectId[];

  static findOne: any;
}
