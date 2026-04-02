import { Schema } from "mongoose";

export interface IMockTestSectionSubmission {
  sectionId: Schema.Types.ObjectId;
  autoGradedScore: number;
  name: string;
  adminScore: number;
  adminFeedback?: string;
  isAutoGraded: boolean;
  totalMarks: number;
  studentAnswers?: { questionId: string; answer: any }[];
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


export interface IMocktestSubmitPayload {
    course: string;
    mockTest: string;
    sections: {
      sectionId: string;
      score: number;
      isAutoGraded: boolean;
      studentAnswers?: any;
      name: string;
      totalMarks: number;
    }[];
}