import { Document, Types } from "mongoose";

export interface IProgress extends Document {
  student:Types.ObjectId; 
  lesson: Types.ObjectId;  
  isCompleted: boolean;
  completedAt?: Date;
}
