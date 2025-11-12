import  { Schema, model, Document } from "mongoose";
import { IAssignmentSubmission } from "./agt.interface";


const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },

    submissionType: {
      type: String,
      enum: ["link", "text", "file"],
      default: "file",
      required: true,
    },

    file: {
      url: { type: String, required: function() { return this.submissionType === "file"; } },
    },

    textResponse: { type: String, default: null },

    submittedAt: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["pending", "reviewed", "graded"],
      default: "pending",
    },

    result: { type: Number, default: null },
    feedback: { type: String, default: null },
  },
  { timestamps: true }
);


assignmentSubmissionSchema.index(
  { student: 1, course: 1, lesson: 1 },
  { unique: true }
);


assignmentSubmissionSchema.index({ course: 1, lesson: 1 });


const AssignmentSubmission = model<IAssignmentSubmission>(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);

export default AssignmentSubmission;
