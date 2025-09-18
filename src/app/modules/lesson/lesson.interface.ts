import { Document, Types } from "mongoose";

export interface ILesson extends Document {
  title: string;
  milestone: Types.ObjectId; 
  order?: number;
  contentType: "video" | "doc" | "quiz";
  videoUrl?: string;
  docContent?: string;
  status?: "active" | "inactive";
}
