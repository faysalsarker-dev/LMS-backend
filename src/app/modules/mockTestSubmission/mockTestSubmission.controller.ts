import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as submissionService from "./mockTestSubmission.service";

export const handleSubmitMockTest = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id || req.user.id;
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
  const submissions = await submissionService.getPendingSubmissions();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending mock test submissions retrieved successfully",
    data: submissions,
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
