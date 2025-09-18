import { Request, Response } from "express";
import * as ProgressService from "./progress.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import  httpStatus  from 'http-status';


// Mark complete
export const markCompleteController = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.body;
  const studentId = req.user.id; // auth middleware required
  const progress = await ProgressService.markLessonComplete(studentId, lessonId);
      sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson marked complete successfully",
    data: progress,
  });
});

// Mark incomplete
export const markIncompleteController = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.body;
  const studentId = req.user.id;
  const progress = await ProgressService.markLessonIncomplete(studentId, lessonId);
      sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson marked incomplete successfully",
    data: progress,
  });

});

// Get all progress for student
export const getProgressController = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user.id;
  const progressList = await ProgressService.getStudentProgress(studentId);
        sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Progress fetched successfully",
    data: progressList,
  });
});
