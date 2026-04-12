import { Document, Types } from "mongoose";

export interface IMockTest extends Document {
  title: string;
  slug: string;
  thumbnail?: string | null;
  isInternational?: boolean;
  course: Types.ObjectId;
  
  listening?: Types.ObjectId;
  reading?: Types.ObjectId;
  writing?: Types.ObjectId;
  speaking?: Types.ObjectId;
  
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
