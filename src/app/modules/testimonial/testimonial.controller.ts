import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import * as testimonialService from "./testimonial.service";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";

export const createOrUpdateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { courseId, rating, review } = req.body;

  const testimonial = await testimonialService.createOrUpdateTestimonial({
    userId,
    courseId,
    rating,
    review,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review submitted successfully.",
    data: testimonial,
  });
});

export const getCourseTestimonials = catchAsync(async(req: Request, res: Response) => {
  const { courseId } = req.params;
  const data = await testimonialService.getAllTestimonialsByCourse(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course testimonials retrieved successfully.",
    data,
  });
});

export const deleteTestimonial = catchAsync(async(req: Request, res: Response) => {
  const userId = req.user._id;
  const { id } = req.params;

  await testimonialService.deleteTestimonial(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Testimonial deleted successfully.",
  });
});
