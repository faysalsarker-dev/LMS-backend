import { Schema } from "mongoose";

export interface IProgress extends Document {
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;

  completedLessons: Schema.Types.ObjectId[];

  progressPercentage: number;
  isCompleted: boolean;

  completedAt: Date | null;
}
