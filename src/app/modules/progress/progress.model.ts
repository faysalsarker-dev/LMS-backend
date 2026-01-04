

import AssignmentSubmission from "../agt/Agt.model";
import { IProgress, IQuizResult } from "./progress.interface";
import { Schema, model, Types } from "mongoose";




const quizResultSchema = new Schema<IQuizResult>(
  {
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    passed: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);






const progressSchema = new Schema<IProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    assignmentSubmissions: [{ type: Schema.Types.ObjectId, ref: "AssignmentSubmission" ,default :null}],
    avgMarks: { type: Number, default: 0 },
    quizResults: { type: [quizResultSchema], default: [] },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

// ---------------------------
// Add completed lesson
// ---------------------------
progressSchema.methods.addCompletedLesson = async function (lessonId: string) {
  if (!this.completedLessons.some((l: any) => l.toString() === lessonId)) {
    this.completedLessons.push(lessonId);
    await this.save();
  }
  return this;
};

// ---------------------------
// Update progress with assignment submission
// ---------------------------
progressSchema.methods.updateWithAssignment = async function (submissionId: string) {
  if (!this.assignmentSubmissions.includes(submissionId)) {
    this.assignmentSubmissions.push(submissionId);
  }

  // Calculate average marks for graded submissions
  const submissions = await AssignmentSubmission.find({
    _id: { $in: this.assignmentSubmissions },
    status: "graded",
  });

  if (submissions.length) {
    const totalMarks = submissions.reduce((sum, s) => sum + (s.result || 0), 0);
    this.avgMarks = totalMarks / submissions.length;
  }

  // Optional: update progressPercentage based on completed lessons + assignments
  const totalItems = this.completedLessons.length + this.assignmentSubmissions.length;
  // Example: totalItems / 100 * 100 = just a demo, you can calculate based on course structure
  this.progressPercentage = Math.min(100, totalItems); 

  if (this.progressPercentage >= 100) this.isCompleted = true;

  await this.save();
  return this;
};

const Progress = model<IProgress>("Progress", progressSchema);
export default Progress;


