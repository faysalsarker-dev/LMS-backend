import AssignmentSubmission from "../agt/Agt.model";
import User from "../auth/User.model";
import Course from "../course/Course.model";
import { IProgress, IQuizResult } from "./progress.interface";
import { Schema, model } from "mongoose";

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
    assignmentSubmissions: [{ type: Schema.Types.ObjectId, ref: "AssignmentSubmission" }],
    mockTestSubmissions: [{ type: Schema.Types.ObjectId, ref: "MockTestSubmission" }],
    avgMarks: { type: Number, default: 0 },
    quizResults: { type: [quizResultSchema], default: [] },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    certificates: {
      name: { type: String, default: null },
      title: { type: String, default: null },
      description: { type: String, default: null },
      issuedAt: { type: Date, default: null },
    },
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
  if (!this.assignmentSubmissions.includes(submissionId as any)) {
    this.assignmentSubmissions.push(submissionId as any);
  }

  const submissions = await AssignmentSubmission.find({
    _id: { $in: this.assignmentSubmissions },
    status: "graded",
  });

  if (submissions.length) {
    const totalMarks = submissions.reduce((sum, s) => sum + (s.result || 0), 0);
    this.avgMarks = totalMarks / submissions.length;
  }

  const totalItems = this.completedLessons.length + this.assignmentSubmissions.length;
  this.progressPercentage = Math.min(100, totalItems);

  if (this.progressPercentage >= 100) {
    this.isCompleted = true;
  }

  await this.save();
  return this;
};

progressSchema.methods.recalculateFromSubmissions = async function () {
  const submissions = await AssignmentSubmission.find({
    _id: { $in: this.assignmentSubmissions },
    status: "graded",
  });

  if (submissions.length) {
    const total = submissions.reduce((sum, s) => sum + (s.result || 0), 0);
    this.avgMarks = total / submissions.length;
  } else {
    this.avgMarks = 0;
  }

  await this.save();
};

// ---------------------------
// Update progress with mock test submission
// ---------------------------
progressSchema.methods.updateWithMockTest = async function () {
  const MockTestSubmission = model("MockTestSubmission");

  const submissions = await MockTestSubmission.find({
    _id: { $in: this.mockTestSubmissions },
    status: "graded",
  });

  if (submissions.length) {
    const totalMockTestScore = submissions.reduce((sum, s) => sum + (s.totalScore || 0), 0);
    const avgMockTestScore = totalMockTestScore / submissions.length;
    this.avgMarks = (this.avgMarks + avgMockTestScore) / 2;
  }

  await this.save();
  return this;
};

// ---------------------------
// Store certificate snapshot
// ---------------------------
progressSchema.methods.generateCertificate = async function (description: string) {
  const [student, course] = await Promise.all([
    User.findById(this.student).select("name"),
    Course.findById(this.course).select("title"),
  ]);

  if (!student) {
    throw new Error("Student not found");
  }

  if (!course) {
    throw new Error("Course not found");
  }

  this.certificates = {
    name: student.name,
    title: course.title,
    description,
    issuedAt: new Date(),
  };

  await this.save();
  return this;
};

const Progress = model<IProgress>("Progress", progressSchema);
export default Progress;
