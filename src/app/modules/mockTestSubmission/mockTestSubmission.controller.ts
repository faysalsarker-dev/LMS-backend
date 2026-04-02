import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ApiError } from "../../errors/ApiError";
import * as submissionService from "./mockTestSubmission.service";

export const handleSubmitMockTest = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id;
  const submission = await submissionService.submitMockTest(studentId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Mock test submitted successfully",
    data: submission,
  });
});

export const handleGetStudentSubmissions = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id || req.user.id;
  const { courseId } = req.params;

  const submissions = await submissionService.getStudentSubmissions(studentId, courseId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student mock test submissions retrieved successfully",
    data: submissions,
  });
});

export const handleGetPendingSubmissions = catchAsync(async (req: Request, res: Response) => {
  const { meta, result } = await submissionService.getPendingSubmissions(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending mock test submissions retrieved successfully",
    meta,
    data: result,
  });
});

export const handleGetSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const submission = await submissionService.getSubmissionById(submissionId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mock test submission retrieved successfully",
    data: submission,
  });
});

export const handleGradeSubmission = catchAsync(async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const { grades } = req.body; // Array of { sectionId, score, feedback }

  const gradedSubmission = await submissionService.gradeSubmission(submissionId, grades);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mock test submission graded successfully",
    data: gradedSubmission,
  });
});

export const handleGetMockTestProgress = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id;
  const { mockTestId } = req.params;

  const progress = await submissionService.getMockTestProgress(studentId, mockTestId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student mock test progress retrieved successfully",
    data: progress,
  });
});

// ─── Speaking Mock Test Submission ───────────────────────────────────────────

export const handleSubmitSpeakingMockTest = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "Audio file is required for speaking mock test submission");
  }





  const studentId = req.user._id;

  // multer-storage-cloudinary puts the Cloudinary URL in req.file.path
  const audioUrl = (req.file as any).path;

  const { course, mockTest, sectionId, questionId,totalMarks } = req.body;

  console.log("Received speaking mock test submission:", {
    studentId,
    course,
    mockTest,
    sectionId,
    questionId,
    audioUrl,
  });

  if (!course || !mockTest || !sectionId) {
    throw new ApiError(400, "course, mockTest, and sectionId are required");
  }

  const payload = {
    course,
    mockTest,
    sections: [
      {
        sectionId,
        score: 0, 
        name: "Speaking",
        isAutoGraded: false,
        totalMarks: Number(totalMarks),
        studentAnswers: [
          {
            questionId: questionId || sectionId, // Fallback to sectionId if questionId is not provided
            answer: audioUrl,
          },
        ],
      },
    ],
  };

  const submission = await submissionService.submitMockTest(studentId, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Speaking mock test submitted successfully",
    data: submission,
  });
});
