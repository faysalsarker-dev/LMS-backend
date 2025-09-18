import { Request, Response } from "express";
import * as LessonService from "./lesson.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import  httpStatus  from 'http-status';


// Create
export const createLessonController = catchAsync(async (req: Request, res: Response) => {
  const lesson = await LessonService.createLesson(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson Created successfully",
    data: lesson,
  });

});

// Get All
export const getAllLessonsController = catchAsync(async (req: Request, res: Response) => {
  const { milestoneId } = req.query;
  const lessons = await LessonService.getAllLessons(milestoneId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lessons fetchedsuccessfully",
    data: lessons,
  });
  

});

// Get Single
export const getSingleLessonController = catchAsync(async (req: Request, res: Response) => {
const lesson = await LessonService.getSingleLesson(req.params.id);
    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson fetched successfully",
    data: lesson,
  });
});

// Update
export const updateLessonController = catchAsync(async (req: Request, res: Response) => {
  const lesson = await LessonService.updateLesson(req.params.id, req.body);
    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson updated successfully",
    data: lesson,
  });

});

// Delete
export const deleteLessonController = catchAsync(async (req: Request, res: Response) => {
  await LessonService.deleteLesson(req.params.id);
      sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson deleted successfully",
    data: null,
  });
});
