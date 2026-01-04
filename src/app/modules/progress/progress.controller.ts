
// import { Request, Response, NextFunction } from "express";
// import * as progressService from "./progress.service";


// /**
//  * Controller to handle marking a lesson as complete.
//  */
// export const handleMarkLessonComplete = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     // Assuming 'req.user.id' is available from your auth middleware
//     const studentId = req.user.id;
    
//     // Get courseId and lessonId from the request body
//     const { courseId, lessonId } = req.body;

//     if (!courseId || !lessonId) {
//       throw new AppError("courseId and lessonId are required", 400);
//     }

//     const updatedProgress = await progressService.markLessonAsComplete(
//       studentId,
//       courseId,
//       lessonId,
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         progress: updatedProgress,
//       },
//     });
//   } catch (error) {
//     next(error); // Pass error to your global error handler
//   }
// };

// /**
//  * Controller to get a student's progress for a single course.
//  */
// export const handleGetStudentProgress = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const studentId = req.user.id;
//     const { courseId } = req.params; // Get courseId from URL parameters

//     if (!courseId) {
//       throw new AppError("courseId parameter is required", 400);
//     }

//     const progress = await progressService.getStudentProgress(
//       studentId,
//       courseId,
//     );

//     res.status(200).json({
//       status: "success",
//       data: {
//         progress,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };




import { Request, Response } from "express";

import * as progressService from "./progress.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

/**
 * Controller to handle marking a lesson as complete.
 */
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

















