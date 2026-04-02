import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as MockTestSectionService from "./mockTestSection.service";
import httpStatus from "http-status";

export const createMockTestSection = catchAsync(async (req: Request, res: Response) => {
  const result = await MockTestSectionService.createMockTestSection(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "MockTest Section created and linked successfully",
    data: result,
  });
});

export const getAllMockTestSections = catchAsync(async (req: Request, res: Response) => {
  const result = await MockTestSectionService.getAllMockTestSections(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "MockTest Sections retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

export const getMockTestSectionById = catchAsync(async (req: Request, res: Response) => {
  const result = await MockTestSectionService.getMockTestSectionById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "MockTest Section retrieved successfully",
    data: result,
  });
});

export const updateMockTestSection = catchAsync(async (req: Request, res: Response) => {
  const result = await MockTestSectionService.updateMockTestSection(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "MockTest Section updated successfully",
    data: result,
  });
});

export const deleteMockTestSection = catchAsync(async (req: Request, res: Response) => {
  const result = await MockTestSectionService.deleteMockTestSection(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "MockTest Section deleted successfully",
    data: result,
  });
});

