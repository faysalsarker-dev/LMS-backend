import { Document, Types } from "mongoose";

export interface IMockTest extends Document {
  title: string;
  slug: string;
  thumbnail?: string | null;
  course: Types.ObjectId;
  
  // References to the 4 specific test parts (we can create a generic TestPart or MockTestSection later)
  listening?: Types.ObjectId;
  reading?: Types.ObjectId;
  writing?: Types.ObjectId;
  speaking?: Types.ObjectId;
  
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
