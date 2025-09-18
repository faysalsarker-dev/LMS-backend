import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug:string,
  description?: string;
  instructor: Types.ObjectId; 
  milestones: Types.ObjectId[]; 
  thumbnail?: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
  averageRating:number;
  totalEnrolled:number;
  createdAt: Date;
  updatedAt: Date;
}
