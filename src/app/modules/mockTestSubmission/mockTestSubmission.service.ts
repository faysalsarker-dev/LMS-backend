import { Types } from "mongoose";
import MockTestSubmission from "./mockTestSubmission.model";
import {
  IMockTestSubmission,
  IMocktestSubmitPayload,
} from "./mockTestSubmission.interface";
import Progress from "../progress/progress.model";
import QueryBuilder from "../../builder/QueryBuilder";

export const submitMockTest = async (
  studentId: string,
  payload: IMocktestSubmitPayload,
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
      name: sec.name,
      // totalMarks: sec.totalMarks,
    }));

    submission = await MockTestSubmission.create({
      student: new Types.ObjectId(studentId),
      course: new Types.ObjectId(payload.course),
      mockTest: new Types.ObjectId(payload.mockTest),
      sections: sectionsToStore,
      totalScore: 0, 
      status: "pending_review",
    });
  } else {
    // Update existing submission with new or updated sections
    incomingSections.forEach((incoming) => {
      const existingSecIndex = submission!.sections.findIndex(
        (s) => s.sectionId.toString() === incoming.sectionId,
      );

      // Handle studentAnswers: if it's an object (mapping ID to answer), convert to the new array format
      let studentAnswersArray = incoming.studentAnswers;
      if (
        incoming.studentAnswers &&
        typeof incoming.studentAnswers === "object" &&
        !Array.isArray(incoming.studentAnswers)
      ) {
        // If it's a map (and not the special speaking {audioUrl} case if sent directly)
        if (!("audioUrl" in incoming.studentAnswers)) {
          studentAnswersArray = Object.entries(incoming.studentAnswers).map(
            ([questionId, answer]) => ({
              questionId,
              answer: answer,
            }),
          );
        } else {
          // It's the speaking special case {audioUrl: "..."}
          // We'll treat it as an answer for the sectionId if no questionId is involved
          // But ideally the controller should have fixed this already.
          studentAnswersArray = [
            {
              questionId: incoming.sectionId,
              answer: incoming.studentAnswers.audioUrl,
            },
          ];
        }
      }

      if (existingSecIndex > -1) {
        const existingSection = submission!.sections[existingSecIndex];
        const existingAnswers = existingSection.studentAnswers || [];
        
        // Merge answers: if an answer for a questionId already exists, update it, else add it
        const mergedAnswers = [...existingAnswers];
        studentAnswersArray.forEach((newAns: any) => {
          const index = mergedAnswers.findIndex(
            (ans: any) => ans.questionId === newAns.questionId
          );
          if (index > -1) {
            mergedAnswers[index] = newAns;
          } else {
            mergedAnswers.push(newAns);
          }
        });

        // Update the existing section
        existingSection.studentAnswers = mergedAnswers as any;
        if (incoming.isAutoGraded) {
          existingSection.autoGradedScore = incoming.score;
        }
        existingSection.isAutoGraded = incoming.isAutoGraded;
        existingSection.name = incoming.name;
        if (incoming.totalMarks !== undefined) {
          existingSection.totalMarks = incoming.totalMarks;
        }
      } else {
        const sectionData = {
          sectionId: new Types.ObjectId(incoming.sectionId),
          studentAnswers: studentAnswersArray,
          autoGradedScore: incoming.isAutoGraded ? incoming.score : 0,
          adminScore: 0,
          isAutoGraded: incoming.isAutoGraded,
          name: incoming.name,
          totalMarks: incoming.totalMarks,
        };
        submission!.sections.push(sectionData as any);
      }
    });
    
    // Explicitly mark the sections array as modified so Mongoose saves the deep changes
    submission!.markModified("sections");
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
    if (
      !progress.mockTestSubmissions.some(
        (id) => id.toString() === subId.toString(),
      )
    ) {
      progress.mockTestSubmissions.push(subId as any);
    }
    await progress.save();

    // If completely graded, trigger progress update
    if (
      submission.status === "graded" &&
      typeof (progress as any).updateWithMockTest === "function"
    ) {
      await (progress as any).updateWithMockTest();
    }
  }

  return submission;
};

export const getStudentSubmissions = async (
  studentId: string,
  courseId: string,
) => {
  return await MockTestSubmission.find({
    student: studentId,
    course: courseId,
  })
    .populate("mockTest")
    .populate("sections.sectionId");
};

export const getPendingSubmissions = async (query: Record<string, unknown>) => {
  const baseQuery: Record<string, unknown> = { status: "pending_review" };

  const submissionQuery = new QueryBuilder(
    MockTestSubmission.find(baseQuery)
      .populate("student", "name email")
      .populate("course", "title")
      .populate("mockTest", "title")
      .populate("sections.sectionId", "name type"),
    query,
  )
    .filter()
    .sort()
    .paginate();

  const result = await submissionQuery.modelQuery;
  const meta = await submissionQuery.countTotal();

  return { meta, result };
};

export const getSubmissionById = async (submissionId: string) => {
  const submission = await MockTestSubmission.findById(submissionId)
    .populate("student", "name email phone")
    .populate("course", "title description")
    .populate("mockTest", "title type")
    .populate("sections.sectionId")
    .lean(); // Use lean for easier transformation

  if (!submission) {
    throw new Error("Submission not found");
  }

  // Transform sections to include full question data paired with user answers
  const transformedSections = submission.sections.map((section: any) => {
    const sectionData = section.sectionId;
    if (!sectionData || !sectionData.questions) return section;

    // studentAnswers is now an array: [{ questionId, answer }]
    const studentAnswers = section.studentAnswers || [];

    // Create a map for quick lookup from the current array format
    const answerMap = new Map();
    studentAnswers.forEach((ans: any) => {
      if (ans.questionId) {
        answerMap.set(ans.questionId.toString(), ans.answer);
      }
    });

    // Map through the original questions from the section and attach the user's answer
    const questionsWithAnswers = sectionData.questions.map((question: any) => {
      const qId = question._id.toString();
      return {
        ...question,
        userAnswer: answerMap.get(qId) || null,
      };
    });

    return {
      ...section,
      questionsWithAnswers, // This is the combined view the admin needs
    };
  });

  return {
    ...submission,
    sections: transformedSections,
  };
};

export const gradeSubmission = async (
  submissionId: string,
  adminGrades: { sectionId: string; score: number; feedback?: string }[],
) => {
  const submission = await MockTestSubmission.findById(submissionId);
  if (!submission) {
    throw new Error("Submission not found");
  }
console.log(adminGrades,'adminGrades');
  let totalAdminScore = 0;
  let totalAutoScore = 0;

  submission.sections.forEach((section) => {
    // If it's a manual section, see if admin provided a grade
    if (!section.isAutoGraded) {
      const gradeInput = adminGrades.find(
        (g) => g.sectionId === section.sectionId.toString(),
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
console.log(submission,'submission');
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

export const getMockTestProgress = async (
  studentId: string,
  mockTestId: string,
) => {
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
      const sectionName = sec.sectionId?.name;
      if (sectionName && sectionName in progress) {
        progress[sectionName as keyof typeof progress] = "submitted";
      }
    });
  }

  return progress;
};

export const updateSectionGrade = async (
  submissionId: string,
  sectionId: string,
  adminScore: number,
  adminFeedback?: string,
) => {
  const submission = await MockTestSubmission.findById(submissionId);

  if (!submission) {
    throw new Error("Submission not found");
  }

  const section = submission.sections.find(
    (s) => s.sectionId.toString() === sectionId,
  );

  if (!section) {
    throw new Error("Section not found in submission");
  }

  section.adminScore = adminScore;
  if (adminFeedback !== undefined) {
    section.adminFeedback = adminFeedback;
  }

  // Recalculate totalScore and Status based on all currently saved sections
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
  return submission;
};



