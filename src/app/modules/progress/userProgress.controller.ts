
import httpStatus from "http-status";
import * as UserProgressService from "./userProgress.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";

export const markItemComplete = catchAsync(async (req:Request, res:Response) => {
  const { userId, courseId, milestoneId, moduleId, type, itemId } = req.body;

  const result = await UserProgressService.markComplete(userId, courseId, milestoneId, moduleId, type, itemId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${type} marked complete`,
    data: result,
  });
});

export const getProgress = catchAsync(async (req:Request, res:Response) => {
  const { userId, courseId } = req.params;

  const result = await UserProgressService.getUserProgress(userId, courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User progress fetched",
    data: result,
  });
});
