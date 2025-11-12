import { Schema } from "mongoose";


export interface IProgress {
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  completedLessons: Schema.Types.ObjectId[];
  assignmentSubmissions: Schema.Types.ObjectId[]; 
  avgMarks?: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  updateWithAssignment(assignmentId: string): Promise<void>;
}
