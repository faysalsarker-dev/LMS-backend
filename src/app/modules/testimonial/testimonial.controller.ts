import { Request, Response } from "express";

import httpStatus from "http-status";
import * as testimonialService from "./testimonial.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// ✅ Create testimonial
export const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const testimonial = await testimonialService.createTestimonial({
    userId: req.user.id,
    ...req.body,
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review added successfully",
    data: testimonial,
  });
});

// ✅ Update testimonial
export const updateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { testimonialId } = req.params;
  const testimonial = await testimonialService.updateTestimonial({
    testimonialId,
    userId: req.user.id,
    ...req.body,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully",
    data: testimonial,
  });
});

// ✅ Public: get summary for a single course
export const getCourseReviewSummary = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const data = await testimonialService.getCourseReviewSummary(courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Course reviews fetched successfully",
    data,
  });
});

// ✅ Admin: paginated + sorted
export const getAllTestimonialsAdmin = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, sort = "newest" } = req.query;
  const data = await testimonialService.getAllTestimonialsAdmin(
    Number(page),
    Number(limit),
    String(sort)
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All testimonials fetched successfully",
    data,
  });
});

// ✅ Public homepage
export const getTopTestimonials = catchAsync(async (req: Request, res: Response) => {
  const data = await testimonialService.getTopTestimonials();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top testimonials fetched successfully",
    data,
  });
});

export const getMyReview = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const testimonial = await testimonialService.getMyReview(userId, courseId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your review fetched successfully",
    data: testimonial,
  });
});

// ✅ Delete
export const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const { testimonialId } = req.params;
  const deletedId = await testimonialService.deleteTestimonial(testimonialId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Testimonial deleted successfully",
    data: deletedId,
  });
});
