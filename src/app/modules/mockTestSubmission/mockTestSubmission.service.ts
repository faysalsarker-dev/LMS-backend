import { Types } from "mongoose";
import MockTestSubmission from "./mockTestSubmission.model";
import { IMockTestSubmission, IMocktestSubmitPayload } from "./mockTestSubmission.interface";
import Progress from "../progress/progress.model";





export const submitMockTest = async (
  studentId: string,
  payload: IMocktestSubmitPayload
): Promise<IMockTestSubmission> => {
  // 1. Find existing submission for this student, course, and mock test
  let submission = await MockTestSubmission.findOne({
    student: studentId,
    course: payload.course,
    mockTest: payload.mockTest,
  });

  const incomingSections = payload.sections;

  if (!submission) {
    // Initial submission
    const sectionsToStore = incomingSections.map((sec) => ({
      sectionId: new Types.ObjectId(sec.sectionId),
      studentAnswers: sec.studentAnswers,
      autoGradedScore: sec.isAutoGraded ? sec.score : 0,
      adminScore: 0,
      isAutoGraded: sec.isAutoGraded,
    }));

    submission = await MockTestSubmission.create({
      student: new Types.ObjectId(studentId),
      course: new Types.ObjectId(payload.course),
      mockTest: new Types.ObjectId(payload.mockTest),
      sections: sectionsToStore,
      totalScore: 0, // Will calculate below
      status: "pending_review",
    });
  } else {
    // Update existing submission with new or updated sections
    incomingSections.forEach((incoming) => {
      const existingSecIndex = submission!.sections.findIndex(
        (s) => s.sectionId.toString() === incoming.sectionId
      );

      const sectionData = {
        sectionId: new Types.ObjectId(incoming.sectionId),
        studentAnswers: incoming.studentAnswers,
        autoGradedScore: incoming.isAutoGraded ? incoming.score : 0,
        adminScore: 0,
        isAutoGraded: incoming.isAutoGraded,
      };

      if (existingSecIndex > -1) {
        submission!.sections[existingSecIndex] = sectionData as any;
      } else {
        submission!.sections.push(sectionData as any);
      }
    });
  }

  // 2. Recalculate totalScore and Status based on all currently saved sections
  let totalScore = 0;
  let allSectionsGraded = true;

  submission.sections.forEach((sec) => {
    if (sec.isAutoGraded) {
      totalScore += sec.autoGradedScore || 0;
    } else {
      // Manual section: check if it has been graded by admin yet
      if (sec.adminScore > 0) {
        totalScore += sec.adminScore;
      } else {
        allSectionsGraded = false;
      }
    }
  });

  submission.totalScore = totalScore;
  submission.status = allSectionsGraded ? "graded" : "pending_review";

  await submission.save();

  // 3. Update Progress array if not already present
  const progress = await Progress.findOne({
    student: studentId,
    course: payload.course,
  });

  if (progress) {
    if (!progress.mockTestSubmissions) {
      progress.mockTestSubmissions = [];
    }
    
    const subId = submission._id as Types.ObjectId;
    if (!progress.mockTestSubmissions.some(id => id.toString() === subId.toString())) {
      progress.mockTestSubmissions.push(subId as any);
    }
    await progress.save();

    // If completely graded, trigger progress update
    if (submission.status === "graded" && typeof (progress as any).updateWithMockTest === "function") {
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

export const getMockTestProgress = async (studentId: string, mockTestId: string) => {
  const submission = await MockTestSubmission.findOne({
    student: studentId,
    mockTest: mockTestId,
  }).populate("sections.sectionId");

  const progress = {
    listening: "locked",
    reading: "locked",
    speaking: "locked",
    writing: "locked",
  };

  if (submission) {
    submission.sections.forEach((sec: any) => {
      const sectionName = sec.sectionId?.name; // assuming population worked and MockTestSection has name
      if (sectionName && sectionName in progress) {
        progress[sectionName as keyof typeof progress] = "submitted";
      }
    });
  }

  return progress;
};



