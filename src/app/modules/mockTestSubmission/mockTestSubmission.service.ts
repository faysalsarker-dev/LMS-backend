import { Types } from "mongoose";
import MockTestSubmission from "./mockTestSubmission.model";
import { IMockTestSubmission } from "./mockTestSubmission.interface";
import Progress from "../progress/progress.model";

export const submitMockTest = async (
  studentId: string,
  payload: {
    course: string;
    mockTest: string;
    sections: {
      sectionId: string;
      studentAnswers: string;
      autoGradedScore: number;
      isAutoGraded: boolean;
    }[];
  }
) => {
  let totalScore = 0;
  let allSectionsAutoGraded = true;

  const sectionsToStore = payload.sections.map((sec) => {
    totalScore += sec.autoGradedScore;
    if (!sec.isAutoGraded) {
      allSectionsAutoGraded = false;
    }
    return {
      sectionId: new Types.ObjectId(sec.sectionId),
      studentAnswers: sec.studentAnswers,
      autoGradedScore: sec.autoGradedScore,
      adminScore: 0,
      isAutoGraded: sec.isAutoGraded,
    };
  });

  const status = allSectionsAutoGraded ? "graded" : "pending_review";

  const submission = await MockTestSubmission.create({
    student: new Types.ObjectId(studentId),
    course: new Types.ObjectId(payload.course),
    mockTest: new Types.ObjectId(payload.mockTest),
    sections: sectionsToStore,
    totalScore,
    status,
  });

  // Update Progress array
  const progress = await Progress.findOne({
    student: studentId,
    course: payload.course,
  });

  if (progress) {
    if (!progress.mockTestSubmissions) {
      progress.mockTestSubmissions = [];
    }
    if (!progress.mockTestSubmissions.includes(submission._id as any)) {
      progress.mockTestSubmissions.push(submission._id as any);
    }
    await progress.save();

    // If perfectly graded immediately, we can trigger an update
    if (status === "graded" && typeof (progress as any).updateWithMockTest === "function") {
      await (progress as any).updateWithMockTest();
    }
  }

  return submission;
};

export const getStudentSubmissions = async (studentId: string, courseId: string) => {
  return await MockTestSubmission.find({
    student: studentId,
    course: courseId,
  })
    .populate("mockTest")
    .populate("sections.sectionId");
};

export const getPendingSubmissions = async () => {
  return await MockTestSubmission.find({ status: "pending_review" })
    .populate("student", "name email")
    .populate("course", "title")
    .populate("mockTest", "title")
    .populate("sections.sectionId", "name type");
};

export const gradeSubmission = async (
  submissionId: string,
  adminGrades: { sectionId: string; score: number; feedback?: string }[]
) => {
  const submission = await MockTestSubmission.findById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }

  let totalAdminScore = 0;
  let totalAutoScore = 0;

  submission.sections.forEach((section) => {
    // If it's a manual section, see if admin provided a grade
    if (!section.isAutoGraded) {
      const gradeInput = adminGrades.find(
        (g) => g.sectionId === section.sectionId.toString()
      );
      if (gradeInput) {
        section.adminScore = gradeInput.score;
        section.adminFeedback = gradeInput.feedback;
      }
      totalAdminScore += section.adminScore || 0;
    }
    totalAutoScore += section.autoGradedScore || 0;
  });

  // Assume if grade is called, admin provides grades for all manual sections
  submission.totalScore = totalAutoScore + totalAdminScore;
  submission.status = "graded";

  await submission.save();

  // Try updating Progress
  const progress = await Progress.findOne({
    student: submission.student,
    course: submission.course,
  });

  if (progress && typeof (progress as any).updateWithMockTest === "function") {
    await (progress as any).updateWithMockTest();
  }

  return submission;
};
