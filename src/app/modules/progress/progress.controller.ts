import { Request, Response } from "express";
import * as progressService from "./progress.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

export const handleMarkLessonComplete = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id;
  const { courseId, lessonId } = req.body;

  const updatedProgress = await progressService.markLessonAsComplete(studentId, courseId, lessonId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson marked as complete successfully",
    data: updatedProgress,
  });
});

export const handleQuizLessonComplete = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id;
  const { courseId, lessonId, passed } = req.body;

  const updatedProgress = await progressService.markQuizAsComplete(studentId, courseId, lessonId, passed);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson marked as complete successfully",
    data: updatedProgress,
  });
});

export const handleGetStudentProgress = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id;
  const { courseId } = req.params;

  const progress = await progressService.getStudentProgress(studentId, courseId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student progress retrieved successfully",
    data: progress,
  });
});

export const handleGenerateCertificate = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id;
  const { courseId } = req.params;

  const svg = await progressService.generateCertificateSvg(studentId, courseId);

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.status(200).send(svg);
});
