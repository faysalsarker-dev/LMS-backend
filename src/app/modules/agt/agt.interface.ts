import { Types } from "mongoose";

export interface IAssignmentSubmission {
  student: Types.ObjectId;
  course: Types.ObjectId;
  lesson: Types.ObjectId;

  submissionType: "link" | "text" | "file";

 fileUrl?: string;

  textResponse?: string | null;

  submittedAt?: Date;
  status: "pending" | "reviewed" | "graded";

  result?: number | null; 
  feedback?: string | null;
}
