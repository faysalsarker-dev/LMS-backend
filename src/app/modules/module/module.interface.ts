import { Types } from "mongoose";

export interface IModule {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  milestone: Types.ObjectId; 
  type: "video" | "quiz" | "document" | "note";
  videoUrl?: string;
  documentUrl?: string;
  notes?: string;
  quiz?: Types.ObjectId; 
  order: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}
