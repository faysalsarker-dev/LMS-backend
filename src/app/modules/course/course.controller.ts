import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as CourseService from './course.service';
import  httpStatus  from 'http-status';
import { ICourseFilters } from "./course.interface";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";


// Create Course
export const createCourse = catchAsync(async (req: Request, res: Response) => {

const payload = {
  ...req.body,
  thumbnail:req?.file?.path,
  instructor:req?.user?._id
}



  const course = await CourseService.createCourse(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

// Get Course by ID
export const getCourseBySlug = catchAsync(async (req: Request, res: Response) => {
  const course = await CourseService.getCourseBySlug(req.params.slug);
  if (!course) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Course not found",
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course fetched successfully",
    data: course,
  });
});


export const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const course = await CourseService.getCourseById(req.params.id);
  if (!course) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Course not found",
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course fetched successfully",
    data: course,
  });
});

// Get All Courses
export const getAllCourses = catchAsync(async (req: Request, res: Response) => {

  const result = await CourseService.getAllCourses(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses fetched successfully",
    data: result,
  });
});

export const getAllCoursesForSelecting = catchAsync(async (req: Request, res: Response) => {

  const result = await CourseService.getAllCoursesForSelecting();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Courses fetched successfully",
    data: result,
  });
});

// Update Course
export const updateCourse = catchAsync(async (req: Request, res: Response) => {

const payload = {
  ...req.body,
  thumbnail:req?.file?.path,
}

  const course = await CourseService.updateCourse(req.params.id, payload);
  if (!course) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Course not found",
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

// Delete Course
export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await CourseService.deleteCourse(req.params.id);

  await deleteImageFromCLoudinary(course?.thumbnail as string)




  if (!course) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Course not found",
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course deleted successfully",
  });
});



//============ Additional  functions ===========

export const getCourseCurriculum = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user?._id; 

  const result = await CourseService.getCurriculumFromDB(courseId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Curriculum fetched successfully",
    data: result,
  });
});

export const getLessonContent = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.params;

  const result = await CourseService.getLessonContentFromDB(lessonId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson content fetched successfully",
    data: result,
  });
});

export const getMyEnrolledCourses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const result = await CourseService.getMyEnrolledCourses(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My enrolled courses fetched successfully",
    data: result,
  });
});

export const getMyWishlistCourses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const result = await CourseService.getMyWishlistCourses(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My wishlist courses fetched successfully",
    data: result,
  });
});