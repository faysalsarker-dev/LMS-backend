import { Schema, model } from "mongoose";
import { IMockTestSubmission, IMockTestSectionSubmission } from "./mockTestSubmission.interface";

const mockTestSectionSubmissionSchema = new Schema<IMockTestSectionSubmission>(
  {
    sectionId: { type: Schema.Types.ObjectId, ref: "MockTestSection", required: true },
    autoGradedScore: { type: Number, default: 0 },
    adminScore: { type: Number, default: 0 },
    adminFeedback: { type: String },
    isAutoGraded: { type: Boolean, default: false },
    studentAnswers: [
    {
      questionId: { 
        type: Schema.Types.ObjectId, 
        ref: "MockTestSection", 
        required: true 
      },
      answer: { type: Schema.Types.Mixed, required: true }
    }
  ]
  },
  { _id: false }
);


const mockTestSubmissionSchema = new Schema<IMockTestSubmission>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    mockTest: { type: Schema.Types.ObjectId, ref: "MockTest", required: true },
    sections: { type: [mockTestSectionSubmissionSchema], default: [] },
    totalScore: { type: Number, default: 0 },
    status: { type: String, enum: ["pending_review", "graded"], default: "pending_review" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const MockTestSubmission = model<IMockTestSubmission>("MockTestSubmission", mockTestSubmissionSchema);
export default MockTestSubmission;
