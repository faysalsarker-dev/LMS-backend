import { Document, Types } from "mongoose";

export interface IMilestone extends Document {
  title: string;
  course: Types.ObjectId;
  lesson: Types.ObjectId[];
  order: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
