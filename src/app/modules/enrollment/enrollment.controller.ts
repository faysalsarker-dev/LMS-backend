
import httpStatus from "http-status";
import * as EnrollmentService from "./enrollment.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";

export const createEnrollment = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.createEnrollment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Enrollment created successfully",
    data: result,
  });
});

export const getAllEnrollments = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.getAllEnrollments();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrollments fetched successfully",
    data: result,
  });
});

export const getEnrollmentById = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.getEnrollmentById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrollment fetched successfully",
    data: result,
  });
});

export const updateEnrollment = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.updateEnrollment(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrollment updated successfully",
    data: result,
  });
});

export const deleteEnrollment = catchAsync(async (req: Request, res: Response) => {
  const result = await EnrollmentService.deleteEnrollment(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Enrollment deleted successfully",
    data: result,
  });
});
