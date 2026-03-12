import { Schema } from "mongoose";

export interface IMockTestSectionSubmission {
  sectionId: Schema.Types.ObjectId;
  studentAnswers: string; // Could be a JSON string of multiple answers, text, or a cloud URL (e.g., for audio)
  autoGradedScore: number;
  adminScore: number;
  adminFeedback?: string;
  isAutoGraded: boolean;
}

export interface IMockTestSubmission {
  student: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  mockTest: Schema.Types.ObjectId;
  sections: IMockTestSectionSubmission[];
  totalScore: number;
  status: "pending_review" | "graded";
  submittedAt?: Date;
}
