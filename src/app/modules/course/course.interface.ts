import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description?: string;
  instructor: Types.ObjectId; 
  milestones: Types.ObjectId[]; 
  image?: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
