import { Schema } from "mongoose";

export interface IQuizResult {
  lesson: Schema.Types.ObjectId;
  passed: boolean;
  attemptedAt: Date;
}

export interface IProgress {
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  completedLessons: Schema.Types.ObjectId[];
  assignmentSubmissions: Schema.Types.ObjectId[]; 
  avgMarks?: number;
quizResults: IQuizResult[];
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  updateWithAssignment(assignmentId: string): Promise<void>;
  recalculateFromSubmissions(): Promise<void>;
}
