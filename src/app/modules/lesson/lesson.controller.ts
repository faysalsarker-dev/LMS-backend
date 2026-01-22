import { Request, Response } from "express";
import * as LessonService from "./lesson.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import  httpStatus  from 'http-status';
import { ApiError } from "../../errors/ApiError";



export const createLessonController = catchAsync(
  async (req: Request, res: Response) => {

    if (req.body.type === "video") {
      const finalVideoUrl = req.file?.path || req.body.videoUrl;

      if (!finalVideoUrl) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Video file or video URL is required"
        );
      }

      req.body.video = {
        url: finalVideoUrl,
        duration: req.body.videoDuration
          ? Number(req.body.videoDuration)
          : null,
      };

      // cleanup temp fields
      delete req.body.videoUrl;
      delete req.body.videoDuration;
    }

    const lesson = await LessonService.createLesson(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lesson Created successfully",
      data: lesson,
    });
  }
);



// Get All
export const getAllLessonsController = catchAsync(async (req: Request, res: Response) => {
    const {
      search,
      status,
      course,
      milestone,
      page = '1',
      limit = '10',
      type
    } = req.query;




    
    const {data , meta} = await LessonService.getAllLessons({
      milestone: milestone as string,
      search: search as string,
      status: status as string,
      course:course as string,
      type:type as string,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10)
    });;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lessons fetchedsuccessfully",
    data: data,
    meta:meta
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
